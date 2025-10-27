import { prisma } from '../utils/prisma';

type ContratoCreateInput = {
  id: string;
  nome: string;
  propostaId: number | null;
  status: string | null;
  descricao: string | null;
  valor: number;
  dataInicio: Date;
  dataFim: Date;
  envolvidos: string | null;
  acoes: string | null;
  permissoes: string | null;
};

export const contratoRepo = {
  async create(data: ContratoCreateInput) {
    console.log('💾 Repo - Criando no banco:', data);
    try {
      const result = await prisma.contrato.create({
        data,
      });
      console.log('✅ Repo - Criado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ Repo - Erro ao criar:', error);
      throw error;
    }
  },

  async findAll() {
    return prisma.contrato.findMany();
  },

  async findById(id: string) {
    return prisma.contrato.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Partial<ContratoCreateInput>) {
    return prisma.contrato.update({
      where: { id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.contrato.delete({
      where: { id },
    });
  },
};
