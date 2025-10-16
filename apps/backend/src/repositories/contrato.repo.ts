import { prisma } from '../utils/prisma';
import { ContratoDTO } from '../dtos/contrato.dto';

export const contratoRepo = {
  async create(data: ContratoDTO) {
    return prisma.contrato.create({
      data,
    });
  },

  async findAll() {
    return prisma.contrato.findMany();
  },

  async findById(id: string) {
    return prisma.contrato.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Partial<ContratoDTO>) {
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