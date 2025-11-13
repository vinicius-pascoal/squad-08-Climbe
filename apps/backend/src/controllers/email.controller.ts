import { Request, Response } from 'express';
import { EmailSendDTO } from '../dtos/email.dto';
import { sendTemplate } from '../services/email.service';
import { prisma } from '../utils/prisma';

export const emailController = {
  async send(req: Request, res: Response) {
    const { usuarios, tipo, data } = req.body as EmailSendDTO;

    // Resolve recipients: user IDs (number) -> fetch emails; strings already emails
    const usuariosArr = usuarios as Array<string | number>;
    const ids = usuariosArr.filter((u: string | number): u is number => typeof u === 'number');
    const emailsDirect = usuariosArr.filter((u: string | number): u is string => typeof u === 'string');

    let emails: string[] = [...emailsDirect];
    if (ids.length) {
      const found = await prisma.usuario.findMany({
        where: { id: { in: ids } },
        select: { email: true },
      });
      emails.push(...found.map((u: any) => u.email));
    }
    // Deduplicate
    emails = Array.from(new Set(emails.map((e) => e.toLowerCase())));

    if (!emails.length) return res.status(400).json({ error: 'Nenhum destinatário válido' });

    await sendTemplate(emails, tipo as any, data);
    res.json({ ok: true, sent: emails.length });
  },
};
