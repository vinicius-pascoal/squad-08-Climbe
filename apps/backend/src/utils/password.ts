import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export async function hashPassword(plain: string) {
<<<<<<< Updated upstream
  const salt = await bcrypt.genSalt(env.bcryptSaltRounds);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string) {
=======
  const salt = await bcrypt.genSalt(env.bcryptRounds);
  return bcrypt.hash(plain, salt);
}

export function comparePassword(plain: string, hash: string) {
>>>>>>> Stashed changes
  return bcrypt.compare(plain, hash);
}
