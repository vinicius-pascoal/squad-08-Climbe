import { z } from 'zod';

export const registerSchema = z.object({
  nomeCompleto: z.string().min(3),
  email: z.string().email(),
  contato: z.string().optional().nullable(),
  senha: z.string().min(8),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const aprovarSchema = z.object({
  id: z.string().regex(/^\d+$/),
}).strict();

export const aprovarBodySchema = z.object({
  cargoId: z.number().int(),
});
export type AprovarDTO = { id: number; cargoId: number };
