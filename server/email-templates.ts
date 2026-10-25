import { emailText, normalizeEmailLanguage } from './email-localization.js';
export interface EmailBoop {
  locale?: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  animal: { url: string; alt: string };
}
function escapeHtml(value: string): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
function escapeEmailData(data: EmailBoop): EmailBoop {
  return { ...data, senderName: escapeHtml(data.senderName), senderEmail: escapeHtml(data.senderEmail), recipientName: escapeHtml(data.recipientName), message: escapeHtml(data.message), animal: { ...data.animal, url: escapeHtml(data.animal.url), alt: escapeHtml(data.animal.alt) } };
}

// Email templates
export function createVerificationEmail(data: EmailBoop, verificationUrl: string): string {
  data = escapeEmailData(data);
  const language = normalizeEmailLanguage(data.locale);
  const t = (source: string, values?: Record<string, string>) => emailText(language, source, values);
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t("Verify Your Boop")}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fff5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #ffb4ac; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #666666; font-size: 28px;">🐈‍⬛ ${t("Verify Your Boop")} 🐾</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="font-size: 18px; color: #666666; margin: 0 0 20px;">
                ${t("Hey {name}!", { name: data.senderName })}
              </p>
              <p style="font-size: 16px; color: #666666; margin: 0 0 20px;">
                ${t("There\'s one more important step! Click the button below to send this adorable pup to <strong>{name}</strong>:", { name: data.recipientName })}
              </p>
              <img src="${data.animal.url}" alt="${data.animal.alt}" style="width: 100%; max-width: 200px; border-radius: 12px; margin-bottom: 20px;">
              ${data.message ? `
              <div style="background-color: #f8f0f0; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">${t("Your message:")}</p>
                <p style="font-size: 16px; color: #4b5563; margin: 0; font-style: italic;">
                  "${data.message}"
                </p>
              </div>
              ` : ''}
              <div style="margin: 24px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(315deg, #f87171 3%, #f69a9a 44%, #f85555 85%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  ${t("Send This Boop!")}
                </a>
              </div>
              <p style="font-size: 14px; color: #9ca3af; margin: 0;">
                ${t("This link expires in 24 hours.")}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                ${t("Didn't request this? You can safely ignore this email.")}
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

export function createRecipientEmail(data: EmailBoop): string {
  const senderEmailParam = encodeURIComponent(data.senderEmail);
  const senderNameParam = encodeURIComponent(data.senderName);
  data = escapeEmailData(data);
  const language = normalizeEmailLanguage(data.locale);
  const t = (source: string, values?: Record<string, string>) => emailText(language, source, values);
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t("You got a Boop!")}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fff5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #ffb4ac; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 28px;">${t("You got a Boop!")} 🐾</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="font-size: 18px; color: #4b5563; margin: 0 0 20px;">
                ${t("Hey {name}!", { name: data.recipientName })} 👋
              </p>
              <img src="${data.animal.url}" alt="${data.animal.alt}" style="width: 100%; max-width: 300px; border-radius: 12px; margin-bottom: 20px;">
              ${data.message ? `
              <div style="background-color: #f8f0f0; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="font-size: 16px; color: #4b5563; margin: 0; font-style: italic;">
                  "${data.message}"
                </p>
              </div>
              ` : ''}
              <p style="font-size: 16px; color: #f87171; margin: 0 0 8px; font-weight: 600;">
                — ${t("{name} sent you this boop!", { name: data.senderName })}
              </p>
              <p style="font-size: 13px; color: #9ca3af; margin: 0 0 24px;">
                ${t("from {email}", { email: data.senderEmail })}
              </p>
              <a href="https://sendaboop.app/?to=${senderEmailParam}&toName=${senderNameParam}&lang=${language}" style="display: inline-block; background: linear-gradient(315deg, rgba(248, 113, 113) 3%, rgb(246, 154, 154) 44%, rgb(248, 85, 85) 85%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 12px;">
                ${t("Send {name} a Boop Back? 🐾", { name: data.senderName })}
              </a>
              <br>
              <a href="https://sendaboop.app" style="display: inline-block; color: #f87171; padding: 8px 16px; text-decoration: none; font-size: 13px; margin-top: 8px;">
                ${t("or send a boop to someone else →")}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f0f0; padding: 16px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 8px;">
                ${t("Sent with love via Send a Boop 🐕")}
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                ${t("Appreciate this app?")} <a href="https://sendaboop.app/contact" style="color: #f87171;">${t("Leave me a message!")}</a>
              </p>
              <p style="font-size: 11px; color: #9ca3af; margin: 8px 0 0;">
                © Alanna Risse 2026
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

export function createSenderEmail(data: EmailBoop): string {
  data = escapeEmailData(data);
  const language = normalizeEmailLanguage(data.locale);
  const t = (source: string, values?: Record<string, string>) => emailText(language, source, values);
  return `
<!DOCTYPE html>
<html lang="${language}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t("Your Boop was sent!")}</title>
</head>

<body
  style="margin: 0; padding: 0; background-color: #fff5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%"
          style="max-width: 500px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #ffb4ac; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 28px;">${t("Boop Sent! 🎈")}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; text-align: center;">
              <p style="font-size: 18px; color: #4b5563; margin: 0 0 20px;">
                ${t("Hey {name}!", { name: data.senderName })}
              </p>
              <p style="font-size: 16px; color: #4b5563; margin: 0 0 20px;">
                ${t("Your boop to <strong>{name}</strong> has been sent successfully!", { name: data.recipientName })}
              </p>
              <img src="${data.animal.url}" alt="${data.animal.alt}"
                style="width: 100%; max-width: 200px; border-radius: 12px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px;">
                ${t("They'll receive a cute photo in their inbox. You're making someone's day brighter!")}
              </p>
              <a href="https://sendaboop.app"
                style="display: inline-block; background-color: #f87171; background: linear-gradient(315deg, rgba(248, 113, 113) 3%, rgb(246, 154, 154) 44%, rgb(248, 85, 85) 85%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                ${t("Send Another Boop 🐶")}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 16px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 8px;">
                ${t("Sent with love via Send a Boop 🐕")}
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                ${t("Appreciate this app?")} <a href="https://ko-fi.com/alannarisse" style="color: #f87171;">${t("Please leave me a tip at Ko-fi!")}</a>
              </p>
              <p style="font-size: 11px; color: #9ca3af; margin: 8px 0 0;">
                © Alanna Risse 2026
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

