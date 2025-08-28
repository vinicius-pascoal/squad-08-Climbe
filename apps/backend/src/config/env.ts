import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3333),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
};
