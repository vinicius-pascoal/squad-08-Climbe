import { z } from 'zod';

export const tokenSchema = z.object({
  grant_type: z.literal('password'),
  username: z.string().min(1),
  password: z.string().min(1),
});

export const googleSchema = z.object({
  grant_type: z.literal('google'),
  access_token: z.string().min(1),
});
export type TokenDTO = z.infer<typeof tokenSchema>;
export type GoogleDTO = z.infer<typeof googleSchema>;
