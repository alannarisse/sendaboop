import { Dog } from './dogs';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export interface SendBoopRequest {
  dog: Dog;
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
  dogId?: string;
  error?: string;
}

export async function sendBoop(data: SendBoopRequest): Promise<SendBoopResponse> {
  const response = await fetch(`${API_URL}/api/send-boop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
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
