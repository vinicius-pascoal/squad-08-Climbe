import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    (req as any).userId = Number(payload.sub);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
