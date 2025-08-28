import { z } from 'zod';

export const registerSchema = z.object({
  nomeCompleto: z.string().min(3),
  cargoId: z.number().int().optional().nullable(),
<<<<<<< Updated upstream
  cpf: z.string().min(11).max(14),     // com ou sem máscara
  email: z.string().email(),
  contato: z.string().optional().nullable(),
  senha: z.string().min(8),            // exigido para preencher senhaHash
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const aprovarSchema = z.object({ id: z.string().regex(/^\d+$/) });
=======
  cpf: z.string().min(11).max(14),
  email: z.string().email(),
  contato: z.string().optional().nullable(),
  senha: z.string().min(8),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export const aprovarSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
>>>>>>> Stashed changes
