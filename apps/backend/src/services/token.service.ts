import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signAccessToken(userId: number) {
  const payload = {};
  return jwt.sign(payload, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn, // ex.: 15m
  });
}
