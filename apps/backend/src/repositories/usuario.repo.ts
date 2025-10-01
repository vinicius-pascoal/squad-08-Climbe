import { prisma } from '../utils/prisma';

export const usuarioRepo = {
  async create(data: any) {
    return prisma.usuario.create({ data, include: { cargo: true } });
  },

  async update(id: number, data: any) {
    return prisma.usuario.update({ where: { id }, data, include: { cargo: true } });
  },

  async findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email }, include: { cargo: true } });
  },

  async findById(id: number) {
    return prisma.usuario.findUnique({ where: { id }, include: { cargo: true } });
  },

  async delete(id: number) {
    return prisma.usuario.delete({ where: { id } });
  },

  async list(opts?: { excludeCargoIds?: number[] }) {
    const where = opts?.excludeCargoIds?.length
      ? { OR: [{ cargoId: null }, { cargoId: { notIn: opts.excludeCargoIds } }] }
      : undefined;

    return prisma.usuario.findMany({
      where,
      include: { cargo: true },
      orderBy: { id: 'asc' },
    });
  },
};
