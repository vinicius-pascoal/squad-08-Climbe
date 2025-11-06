import { prisma } from '../utils/prisma';
import type { Prisma } from '@prisma/client';

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
    return prisma.usuario.findUnique({ where: { id }, include: { cargo: true, usuarioPermissoes: { include: { permissao: true } } } });
  },

  async delete(id: number) {
    // Ao invés de deletar fisicamente (causa FK violations), marcamos como desativado e desvinculamos cargo
    return prisma.usuario.update({ where: { id }, data: { situacao: 'desativado', cargoId: null } });
  },

  async list(opts?: { excludeCargoIds?: number[] }) {
    // por padrão, não retornar usuários com situacao = 'desativado'
    const baseWhere = opts?.excludeCargoIds?.length
      ? { OR: [{ cargoId: null }, { cargoId: { notIn: opts.excludeCargoIds } }] }
      : undefined;

    const where = baseWhere
      ? { AND: [baseWhere, { NOT: { situacao: 'desativado' } }] }
      : { NOT: { situacao: 'desativado' } };

    return prisma.usuario.findMany({
      where,
      include: { cargo: true, usuarioPermissoes: { include: { permissao: true } } },
      orderBy: { id: 'asc' },
    });
  },
};
