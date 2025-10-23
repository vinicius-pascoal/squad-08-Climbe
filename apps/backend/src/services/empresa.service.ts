import { prisma } from '../utils/prisma';

type EmpresaCreateData = {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string; 
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  representanteCpf?: string;
  representanteContato?: string;
};

type EmpresaUpdateData = Partial<EmpresaCreateData>;

export const empresaService = {
 
  async create(data: EmpresaCreateData) {
    return prisma.empresa.create({
      data,
    });
  },

  
  async findAll() {
    return prisma.empresa.findMany({
      orderBy: { razaoSocial: 'asc' },
     
    });
  },

  
  async findById(id: number) {
    return prisma.empresa.findUnique({
      where: { id },
    });
  },

  
  async update(id: number, data: EmpresaUpdateData) {
    return prisma.empresa.update({
      where: { id },
      data,
    });
  },

  
  async remove(id: number) {
    return prisma.empresa.delete({
      where: { id },
    });
  },
};
