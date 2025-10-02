import { z } from "zod";

export const contratoSchema = z.object({
  id: z.number().int().optional(),
  nome: z.string().min(1),
  propostaId: z.string().min(1),
  status: z.string().optional(),
  descricao: z.string().optional(),
  valor: z.number(),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
  envolvidos: z.string().optional(),
  acoes: z.string().optional(),
  permissoes: z.string().optional(),
});

export type ContratoDTO = z.infer<typeof contratoSchema>;