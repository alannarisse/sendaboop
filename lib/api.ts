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
  message?: string;
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
