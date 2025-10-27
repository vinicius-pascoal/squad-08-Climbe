import { z } from "zod";

export const contratoSchema = z.object({
  id: z.string().min(1, "ID do contrato é obrigatório"),
  nome: z.string().min(1, "Nome do contrato é obrigatório"),
  propostaId: z.number().int().positive().optional(),
  status: z.string().optional(),
  descricao: z.string().optional(),
  valor: z.number().nonnegative("Valor não pode ser negativo"),
  dataInicio: z.string().datetime({ offset: true }),
  dataFim: z.string().datetime({ offset: true }),
  envolvidos: z.string().optional(),
  acoes: z.string().optional(),
  permissoes: z.string().optional(),
});

export type ContratoDTO = z.infer<typeof contratoSchema>;
