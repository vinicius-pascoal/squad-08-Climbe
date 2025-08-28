import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signAccessToken(userId: number) {
<<<<<<< Updated upstream
  const payload = {};
  return jwt.sign(payload, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn, // ex.: 15m
  });
=======
  return jwt.sign({}, env.jwtSecret, { subject: String(userId), expiresIn: env.jwtExpiresIn });
>>>>>>> Stashed changes
}
