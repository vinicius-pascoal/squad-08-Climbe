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

export const adminCreateSchema = z.object({
  nomeCompleto: z.string().min(3),
  email: z.string().email(),
  contato: z.string().optional().nullable(),
  senha: z.string().min(8),
  cargoId: z.number().int(),
  situacao: z.enum(['aprovado', 'pendente', 'desativado']).default('pendente'),
});
export type AdminCreateDTO = z.infer<typeof adminCreateSchema>;

export const updateUsuarioParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
}).strict();

export const updateUsuarioBodySchema = z.object({
  nomeCompleto: z.string().min(3).optional(),
  email: z.string().email().optional(),
  contato: z.string().optional().nullable(),
  cargoId: z.number().int().optional().nullable(),
  situacao: z.enum(['aprovado', 'pendente', 'desativado']).optional(),
  senha: z.string().min(8).optional(),
});
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioBodySchema>;
