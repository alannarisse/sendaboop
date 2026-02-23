import { Animal } from './animals';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export interface SendBoopRequest {
  animal: Animal;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

export interface SendBoopResponse {
  success: boolean;
  pendingVerification?: boolean;
  message?: string;
  error?: string;
}

export interface VerifyBoopResponse {
  success: boolean;
  recipientName?: string;
  animalUid?: number;
  error?: string;
}

export async function sendBoop(data: SendBoopRequest): Promise<SendBoopResponse> {
  // Only send the properties the server needs (exclude image which doesn't serialize)
  const payload = {
    animal: {
      uid: data.animal.uid,
      breed: data.animal.breed,
      animal: data.animal.animal,
      url: data.animal.url,
      alt: data.animal.alt,
    },
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    recipientName: data.recipientName,
    recipientEmail: data.recipientEmail,
    message: data.message,
  };

  const response = await fetch(`${API_URL}/api/send-boop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send boop');
  }

  return response.json();
}

export async function verifyBoop(token: string): Promise<VerifyBoopResponse> {
  const response = await fetch(`${API_URL}/api/verify-boop/${encodeURIComponent(token)}`, {
    method: 'GET',
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'Verification failed',
    };
  }

  return data;
}
