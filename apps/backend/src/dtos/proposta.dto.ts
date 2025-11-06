import { z } from 'zod';

export const createPropostaSchema = z.object({
  empresaId: z.number().int().positive('ID da empresa é obrigatório'),
  status: z.enum(['APROVADA', 'REVISAO', 'REPROVADA', 'PENDENTE']).optional().default('PENDENTE'),
  documentoUrl: z.string().url('URL do documento inválida').optional(),
});

export const updatePropostaSchema = z.object({
  status: z.enum(['APROVADA', 'REVISAO', 'REPROVADA', 'PENDENTE']).optional(),
  documentoUrl: z.string().url('URL do documento inválida').optional(),
});

export const propostaIdSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
});

export type CreatePropostaDto = z.infer<typeof createPropostaSchema>;
export type UpdatePropostaDto = z.infer<typeof updatePropostaSchema>;
