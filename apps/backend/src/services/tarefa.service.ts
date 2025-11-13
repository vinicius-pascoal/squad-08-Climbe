import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

// Define o formato dos dados necessários para criar uma nova tarefa.
type TarefaCreateData = {
  titulo: string;
  descricao?: string;
  status?: string;
  usuarioId?: number;
  propostaId?: number;
  categoria?: string;
};

// Define o formato para atualizar uma tarefa (todos os campos são opcionais).
type TarefaUpdateData = Partial<TarefaCreateData>;

export const tarefaService = {
  async create(data: TarefaCreateData) {
    // Use unchecked create when passing foreign keys directly (usuarioId, propostaId)
    return prisma.tarefa.create({
      data: data as unknown as Prisma.TarefaUncheckedCreateInput,
    });
  },

  async findAll(propostaId?: number) {
    const where: any = {}
    if (typeof propostaId === 'number' && !isNaN(propostaId)) where.propostaId = propostaId
    return prisma.tarefa.findMany({
      where,
      orderBy: { dataCriacao: 'desc' },
      include: {
        usuario: {
          select: { id: true, nomeCompleto: true }
        },
        proposta: {
          select: { id: true, empresaId: true, status: true }
        }
      }
    });
  },

  async findById(id: number) {
    return prisma.tarefa.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nomeCompleto: true }
        }
        ,
        proposta: {
          select: { id: true, empresaId: true, status: true }
        }
      }
    });
  },

  async update(id: number, data: TarefaUpdateData) {
    // Use unchecked update when updating scalar FK fields like usuarioId/propostaId
    return prisma.tarefa.update({
      where: { id },
      data: data as unknown as Prisma.TarefaUncheckedUpdateInput,
    });
  },

  async remove(id: number) {
    return prisma.tarefa.delete({
      where: { id },
    });
  },
};
