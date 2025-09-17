import nodemailer from 'nodemailer';
import { mail } from '../config/env';
import { templates, EmailTemplateType } from '../templates/email';

function buildTransport() {
  if (!mail.enabled) {
    return {
      sendMail: async (opts: any) => {
        console.log('[MAIL:DISABLED]', opts);
        return { messageId: 'disabled' };
      },
    } as any;
  }
  if (!mail.host || !mail.user) {
    // Fallback: console
    return {
      sendMail: async (opts: any) => {
        console.log('[MAIL:FALLBACK]', opts);
        return { messageId: 'console' };
      },
    } as any;
  }
  return nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.secure,
    auth: { user: mail.user, pass: mail.pass },
  });
}

const transporter = buildTransport();

export async function sendTemplate(to: string[], tipo: EmailTemplateType, data?: Record<string, any>) {
  const t = templates[tipo];
  if (!t) throw new Error('Tipo de e-mail inválido');
  const { subject, html, text } = t(data);
  const info = await transporter.sendMail({
    from: mail.from,
    to: to.join(','),
    subject,
    html,
    text,
  });
  return info;
}
