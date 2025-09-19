import { prisma } from '../utils/prisma';
import type { Prisma } from '@prisma/client';

export const usuarioRepo = {
  create(data: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({ data });
  },
  findByEmail(username: string) {
    return prisma.usuario.findFirst({
      where: { email: username.toLowerCase() },
    });
  },
  findById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  },
  list() {
    return prisma.usuario.findMany({ include: { cargo: true } });
  },
  update(id: number, data: Prisma.UsuarioUpdateInput) {
    return prisma.usuario.update({ where: { id }, data });
  },
  delete(id: number) {
    return prisma.usuario.delete({ where: { id } });
  },
};
