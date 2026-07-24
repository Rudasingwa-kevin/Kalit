import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EMAIL MOCK] To: ${to}\nSubject: ${subject}\n${html}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@kalit.rw",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export function buildResetPasswordEmail(resetLink: string): { subject: string; html: string } {
  return {
    subject: "Reset Your Kalit Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <div style="background:#0A2540;padding:32px;text-align:center;">
            <h1 style="color:#fff;font-size:24px;margin:0;">Kalit</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0;">Construction Management</p>
          </div>
          <div style="padding:40px 32px;">
            <h2 style="color:#0A2540;font-size:20px;margin:0 0 12px;">Reset your password</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
            </p>
            <a href="${resetLink}" style="display:inline-block;background:#4A90D9;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;">
              Reset Password
            </a>
            <p style="color:#999;font-size:12px;line-height:1.6;margin:32px 0 0;">
              If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
          <div style="background:#f8f9fa;padding:20px 32px;text-align:center;">
            <p style="color:#999;font-size:11px;margin:0;">© ${new Date().getFullYear()} Kalit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function buildVerificationEmail(code: string): { subject: string; html: string } {
  return {
    subject: "Verify Your Kalit Email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <div style="background:#0A2540;padding:32px;text-align:center;">
            <h1 style="color:#fff;font-size:24px;margin:0;">Kalit</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0;">Construction Management</p>
          </div>
          <div style="padding:40px 32px;text-align:center;">
            <h2 style="color:#0A2540;font-size:20px;margin:0 0 12px;">Verify your email</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Use the code below to verify your email address. This code expires in <strong>15 minutes</strong>.
            </p>
            <div style="background:#f0f4f8;border-radius:12px;padding:20px;margin:0 0 24px;">
              <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#0A2540;font-family:monospace;">${code}</span>
            </div>
            <p style="color:#999;font-size:12px;line-height:1.6;margin:0;">
              If you didn't create an account, you can safely ignore this email.
            </p>
          </div>
          <div style="background:#f8f9fa;padding:20px 32px;text-align:center;">
            <p style="color:#999;font-size:11px;margin:0;">© ${new Date().getFullYear()} Kalit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
