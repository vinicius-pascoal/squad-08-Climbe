import { z } from 'zod';

export const tokenSchema = z.object({
  grant_type: z.literal('password'),
  username: z.string().min(1),
  password: z.string().min(1),
});
export type TokenDTO = z.infer<typeof tokenSchema>;
