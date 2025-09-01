import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
};
