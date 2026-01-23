import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface Dog {
  id: string;
  url: string;
  alt: string;
}

interface SendBoopRequest {
  dog: Dog;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

// Email templates
function createRecipientEmail(data: SendBoopRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You got a Boop!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #f8b4d9; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 28px;">You got a Boop! 🐾</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="font-size: 18px; color: #4b5563; margin: 0 0 20px;">
                Hey ${data.recipientName}! 👋
              </p>
              <img src="${data.dog.url}" alt="${data.dog.alt}" style="width: 100%; max-width: 300px; border-radius: 12px; margin-bottom: 20px;">
              ${data.message ? `
              <div style="background-color: #fdf2f8; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 16px; color: #4b5563; margin: 0; font-style: italic;">
                  "${data.message}"
                </p>
              </div>
              ` : ''}
              <p style="font-size: 16px; color: #f472b6; margin: 0; font-weight: 600;">
                — ${data.senderName} sent you this boop!
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                Sent with love via Send a Boop 🐕
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function createSenderEmail(data: SendBoopRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Boop was sent!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #f8b4d9; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 28px;">Boop Sent! 🎉</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="font-size: 18px; color: #4b5563; margin: 0 0 20px;">
                Hey ${data.senderName}!
              </p>
              <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px;">
                Your boop to <strong>${data.recipientName}</strong> has been sent successfully!
              </p>
              <img src="${data.dog.url}" alt="${data.dog.alt}" style="width: 100%; max-width: 200px; border-radius: 12px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                They'll receive a cute doggo in their inbox. You're making someone's day brighter! ✨
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                Sent with love via Send a Boop 🐕
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Routes
app.post('/api/send-boop', async (req, res) => {
  try {
    const data: SendBoopRequest = req.body;

    // Validate required fields
    if (!data.dog || !data.senderName || !data.senderEmail || !data.recipientName || !data.recipientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.senderEmail) || !emailRegex.test(data.recipientEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send email to recipient
    const recipientResult = await resend.emails.send({
      from: 'Send a Boop <sendaboopmain@sendaboop.app>',
      to: data.recipientEmail,
      subject: `${data.senderName} sent you a Boop! 🐾`,
      html: createRecipientEmail(data),
    });

    if (recipientResult.error) {
      console.error('Failed to send recipient email:', recipientResult.error);
      return res.status(500).json({ error: 'Failed to send email to recipient' });
    }

    // Send confirmation email to sender
    const senderResult = await resend.emails.send({
      from: 'Send a Boop <sendaboopmain@sendaboop.app>',
      to: data.senderEmail,
      subject: `Your Boop to ${data.recipientName} was sent! 🎉`,
      html: createSenderEmail(data),
    });

    if (senderResult.error) {
      console.error('Failed to send sender confirmation:', senderResult.error);
      // Don't fail the request if sender confirmation fails
    }

    res.json({
      success: true,
      message: 'Boop sent successfully!'
    });
  } catch (error) {
    console.error('Error sending boop:', error);
    res.status(500).json({ error: 'Failed to send boop. Please try again.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🐕 Send a Boop server running on http://localhost:${PORT}`);

  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Warning: RESEND_API_KEY not set. Emails will not be sent.');
  }
});
