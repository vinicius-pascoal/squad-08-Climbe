import { prisma } from '../utils/prisma';
import { Usuario } from '@prisma/client';

export const usuarioRepo = {
  create(data: Omit<Usuario, 'id'>) {
    return prisma.usuario.create({ data });
  },
  findByEmailOrCpf(username: string) {
    return prisma.usuario.findFirst({
      where: { OR: [{ email: username.toLowerCase() }, { cpf: username }] },
    });
  },
  findById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  },
  list() {
    return prisma.usuario.findMany();
  },
  update(id: number, data: Partial<Usuario>) {
    return prisma.usuario.update({ where: { id }, data });
  },
  delete(id: number) {
    return prisma.usuario.delete({ where: { id } });
  },
};
