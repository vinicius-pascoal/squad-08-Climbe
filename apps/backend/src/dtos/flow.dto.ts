import { z, AnyZodObject } from 'zod';

export const startFlowBodySchema = z.object({
  nome: z.string().min(1).max(255).optional(),
  empresaId: z.number().int().positive().optional(),
  participantIds: z.array(z.number().int().positive()).optional(),
  scheduledAt: z.string().datetime().optional(), // ISO para reunião inicial
  reuniao: z.object({
    titulo: z.string().min(1).max(255).optional(),
    presencial: z.boolean().optional(),
    local: z.string().max(255).optional(),
    pauta: z.string().optional()
  }).optional()
});

export const advanceFlowParamsSchema = z.object({ id: z.string().regex(/^\d+$/) });
export const advanceFlowBodySchema = z.object({ scheduledAt: z.string().datetime().optional() });

export const scheduleStepParamsSchema = z.object({ id: z.string().regex(/^\d+$/), stepId: z.string().regex(/^\d+$/) });
export const scheduleStepBodySchema = z.object({ scheduledAt: z.string().datetime() });

export const linkPropostaParamsSchema = z.object({ id: z.string().regex(/^\d+$/) });
export const linkPropostaBodySchema = z.object({ propostaId: z.number().int().positive() });

export const linkContratoParamsSchema = z.object({ id: z.string().regex(/^\d+$/) });
export const linkContratoBodySchema = z.object({ contratoId: z.string().min(1) });

export type StartFlowBody = z.infer<typeof startFlowBodySchema>;
