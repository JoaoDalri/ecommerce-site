import nodemailer from 'nodemailer';

// IMPORTANTE: Configure estas variáveis no seu .env.local
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.exemplo.com';
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER || 'user@exemplo.com';
const SMTP_PASS = process.env.SMTP_PASS || 'suasenha';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@loja.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true para 465, false para outras portas
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  try {
    await transporter.sendMail({
      from: `LojaPro <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`Email enviado para ${to}: ${subject}`);
  } catch (error) {
    console.error(`Falha ao enviar email para ${to}:`, error);
  }
}