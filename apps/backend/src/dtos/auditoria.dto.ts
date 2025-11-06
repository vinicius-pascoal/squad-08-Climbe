import { z } from 'zod';

export const createAuditoriaSchema = z.object({
  usuarioId: z.number().int().positive().optional(),
  acao: z.string().min(1, 'Ação é obrigatória'),
  entidade: z.string().min(1, 'Entidade é obrigatória'),
  entidadeId: z.number().int().positive().optional(),
  descricao: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  dadosAntes: z.string().optional(),
  dadosDepois: z.string().optional(),
});

export const auditoriaQuerySchema = z.object({
  entidade: z.string().optional(),
  usuarioId: z.string().optional().transform((val) => val ? Number(val) : undefined),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  acao: z.string().optional(),
  page: z.string().optional().transform((val) => val ? Number(val) : 1),
  limit: z.string().optional().transform((val) => val ? Number(val) : 50),
});

export type CreateAuditoriaDto = z.infer<typeof createAuditoriaSchema>;
export type AuditoriaQueryDto = z.infer<typeof auditoriaQuerySchema>;
