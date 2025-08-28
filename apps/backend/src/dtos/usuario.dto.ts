import { z } from 'zod';

export const registerSchema = z.object({
  nomeCompleto: z.string().min(3),
  cargoId: z.number().int().optional().nullable(),
  cpf: z.string().min(11).max(14),     // com ou sem máscara
  email: z.string().email(),
  contato: z.string().optional().nullable(),
  senha: z.string().min(8),            // exigido para preencher senhaHash
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const aprovarSchema = z.object({ id: z.string().regex(/^\d+$/) });
