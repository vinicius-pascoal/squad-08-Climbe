import { prisma } from '../utils/prisma';

// Define o formato dos dados necessários para criar uma nova tarefa.
type TarefaCreateData = {
  titulo: string;
  descricao?: string;
  status?: string;
  usuarioId?: number;
};

// Define o formato para atualizar uma tarefa (todos os campos são opcionais).
type TarefaUpdateData = Partial<TarefaCreateData>;

export const tarefaService = {
  async create(data: TarefaCreateData) {
    return prisma.tarefa.create({
      data,
    });
  },

  async findAll() {
    return prisma.tarefa.findMany({
      orderBy: { dataCriacao: 'desc' },
      include: {
        usuario: {
          select: { id: true, nomeCompleto: true }
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
      }
    });
  },

  async update(id: number, data: TarefaUpdateData) {
    return prisma.tarefa.update({
      where: { id },
      data,
    });
  },

  async remove(id: number) {
    return prisma.tarefa.delete({
      where: { id },
    });
  },
};

