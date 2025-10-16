import { z } from "zod";

export const contratoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  propostaId: z.number().int().optional(),
  status: z.string().optional(),
  descricao: z.string().optional(),
  valor: z.number(),
  dataInicio: z.string().datetime({ offset: true }),
  dataFim: z.string().datetime({ offset: true }),
  envolvidos: z.string().optional(),
  acoes: z.string().optional(),
  permissoes: z.string().optional(),
});

export type ContratoDTO = z.infer<typeof contratoSchema>;