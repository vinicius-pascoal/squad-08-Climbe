import { z } from 'zod';

export const tokenSchema = z.object({
  grant_type: z.literal('password'),
<<<<<<< Updated upstream
  username: z.string(), // aceitar email ou cpf
=======
  username: z.string().min(1),
>>>>>>> Stashed changes
  password: z.string().min(1),
});
export type TokenDTO = z.infer<typeof tokenSchema>;
