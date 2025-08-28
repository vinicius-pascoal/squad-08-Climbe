import { z } from 'zod';

export const tokenSchema = z.object({
  grant_type: z.literal('password'),
  username: z.string(), // aceitar email ou cpf
  password: z.string().min(1),
});
export type TokenDTO = z.infer<typeof tokenSchema>;
