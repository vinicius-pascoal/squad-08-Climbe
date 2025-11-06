import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { env } from '../config/env';
import { usuarioRepo } from '../repositories/usuario.repo';

/**
 * Accepts our app JWT (from password or Google login flow) OR a Google ID token.
 * - Prefers verifying our own JWT with JWT_SECRET.
 * - If that fails, tries to verify a Google ID token (Authorization: Bearer <id_token>).
 *   When valid, sets req.userEmail and, if a matching user exists, req.userId.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.slice(7);

  // Try internal JWT first. If valid, attach the decoded payload to the request so downstream
  // permission checks can read cargo/permissoes without another DB roundtrip.
  try {
    const payload = jwt.verify(token, env.jwtSecret) as any;
    (req as any).tokenPayload = payload;
    if (payload?.sub) (req as any).userId = Number(payload.sub);
    return next();
  } catch {
    // ignore and try Google ID token fallback
  }

  // Try as Google ID token
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH2_ID || undefined;
  if (!clientId) return res.status(401).json({ error: 'Token inválido' });
  try {
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: token, audience: clientId });
    const payload = ticket.getPayload() as TokenPayload | undefined;
    if (!payload?.email) return res.status(401).json({ error: 'Token inválido' });
    (req as any).userEmail = payload.email;

    // Link to local user if exists
    try {
      const user = await usuarioRepo.findByEmail(payload.email);
      if (user?.id) (req as any).userId = user.id;
    } catch { }

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
