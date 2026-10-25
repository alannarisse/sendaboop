import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { SignJWT, jwtVerify } from 'jose';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import { createVerificationEmail, createRecipientEmail, createSenderEmail } from './email-templates.js';
import { emailText, normalizeEmailLanguage } from './email-localization.js';
import { createVerificationUrl } from './verification-links.js';

const app = express();
const PORT = process.env.PORT || 3001;
const APP_URL = process.env.APP_URL || 'https://sendaboop.app';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// JWT Secret for signing tokens
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'development-secret-change-in-production'
);

// In-memory storage for used tokens (prevents replay attacks)
const usedTokens = new Set<string>();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiters
const sendBoopLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per IP
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyBoopLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  message: { error: 'Too many verification attempts.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Types
interface Animal {
  uid: number;
  breed: string;
  animal: string;
  url: string;
  alt: string;
}

interface SendBoopRequest {
  locale?: string;
  clientPlatform?: string;
  animal: Animal;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

interface PendingBoopPayload {
  locale?: string;
  animal: Animal;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  jti: string; // Unique token ID
}

// Token functions
async function createVerificationToken(data: SendBoopRequest): Promise<string> {
  const tokenId = randomUUID();

  return new SignJWT({
    locale: normalizeEmailLanguage(data.locale),
    animal: data.animal,
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    recipientName: data.recipientName,
    recipientEmail: data.recipientEmail,
    message: data.message,
    jti: tokenId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

async function verifyToken(token: string): Promise<{ valid: true; payload: PendingBoopPayload } | { valid: false; error: string }> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const boopPayload = payload as unknown as PendingBoopPayload;

    // Check if token has been used
    if (usedTokens.has(boopPayload.jti)) {
      return { valid: false, error: 'Token already used' };
    }

    return { valid: true, payload: boopPayload };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('exp')) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: false, error: 'Invalid token' };
  }
}

// Routes

// Step 1: User submits form - send verification email to sender
app.post('/api/send-boop', sendBoopLimiter, async (req, res) => {
  try {
    const data: SendBoopRequest = req.body;

    // Validate required fields
    if (!data.animal || !data.senderName || !data.senderEmail || !data.recipientName || !data.recipientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.senderEmail) || !emailRegex.test(data.recipientEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create verification token
    const token = await createVerificationToken(data);
    const verificationUrl = createVerificationUrl(APP_URL, token, data.clientPlatform, data.locale);

    // Send verification email to sender
    const result = await resend.emails.send({
      from: 'Send a Boop <sendaboopmain@sendaboop.app>',
      to: data.senderEmail,
      subject: emailText(data.locale, 'Verify your boop to {name}', { name: data.recipientName }),
      html: createVerificationEmail(data, verificationUrl),
    });

    if (result.error) {
      console.error('Failed to send verification email:', result.error);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      success: true,
      pendingVerification: true,
      message: 'Verification email sent! Check your inbox.',
    });
  } catch (error) {
    console.error('Error sending boop:', error);
    res.status(500).json({ error: 'Failed to send boop. Please try again.' });
  }
});

// Step 2: User clicks verification link - send actual boop
app.get('/api/verify-boop/:token', verifyBoopLimiter, async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, error: 'No token provided' });
    }

    // Verify the token
    const result = await verifyToken(token);

    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.error });
    }

    const data = result.payload;

    // Mark token as used BEFORE sending emails (prevent race conditions)
    usedTokens.add(data.jti);

    // Send email to recipient (with sender's email as reply-to so they can respond)
    const recipientResult = await resend.emails.send({
      from: 'Send a Boop <sendaboopmain@sendaboop.app>',
      to: data.recipientEmail,
      replyTo: data.senderEmail,
      subject: emailText(data.locale, '{name} sent you a Boop! 🐾', { name: data.senderName }),
      html: createRecipientEmail(data),
    });

    if (recipientResult.error) {
      console.error('Failed to send recipient email:', recipientResult.error);
      // Remove from used tokens so they can try again
      usedTokens.delete(data.jti);
      return res.status(500).json({ success: false, error: 'Failed to send boop' });
    }

    // Send confirmation email to sender
    const senderResult = await resend.emails.send({
      from: 'Send a Boop <sendaboopmain@sendaboop.app>',
      to: data.senderEmail,
      subject: emailText(data.locale, 'Your Boop to {name} was sent! 🎉', { name: data.recipientName }),
      html: createSenderEmail(data),
    });

    if (senderResult.error) {
      console.error('Failed to send sender confirmation:', senderResult.error);
      // Don't fail the request - the boop was still sent
    }

    res.json({
      success: true,
      recipientName: data.recipientName,
      animalUid: data.animal.uid,
    });
  } catch (error) {
    console.error('Error verifying boop:', error);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

// Contact form
interface ContactRequest {
  name: string;
  email: string;
  comments: string;
}

function createContactEmail(data: ContactRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #f9d8d8; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 28px;">New Contact Form Message 📬</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;"><strong>From:</strong></p>
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px;">${data.name}</p>

              <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;"><strong>Email:</strong></p>
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 16px;">
                <a href="mailto:${data.email}" style="color: #f87171;">${data.email}</a>
              </p>

              <p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;"><strong>Message:</strong></p>
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
                <p style="font-size: 16px; color: #4b5563; margin: 0; white-space: pre-wrap;">${data.comments}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                Sent via Send a Boop Contact Form 🐕
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

app.post('/api/contact', async (req, res) => {
  try {
    const data: ContactRequest = req.body;

    // Validate required fields
    if (!data.name || !data.email || !data.comments) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Send contact form email
    const result = await resend.emails.send({
      from: 'Send a Boop Contact <sendaboopmain@sendaboop.app>',
      to: 'sendaboop@gmail.com',
      replyTo: data.email,
      subject: `Contact Form: Message from ${data.name}`,
      html: createContactEmail(data),
    });

    if (result.error) {
      console.error('Failed to send contact email:', result.error);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    res.json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
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

  if (process.env.JWT_SECRET === undefined) {
    console.warn('⚠️  Warning: JWT_SECRET not set. Using development default (not secure for production).');
  }
});
