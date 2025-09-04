import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signAccessToken(userId: number) {
  return jwt.sign({}, env.jwtSecret, { subject: String(userId), expiresIn: env.jwtExpiresIn });
}
