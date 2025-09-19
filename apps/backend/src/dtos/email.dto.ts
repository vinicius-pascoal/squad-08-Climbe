import { z } from 'zod';

export const emailSendSchema = z.object({
  tipo: z.enum(['boas-vindas', 'atualizacao-contrato']),
  usuarios: z.array(z.union([z.string().email(), z.number().int()])).nonempty(),
  data: z.record(z.any()).optional(),
});
export type EmailSendDTO = z.infer<typeof emailSendSchema>;
