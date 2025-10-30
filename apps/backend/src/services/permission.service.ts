import { prisma } from '../utils/prisma';

export const permissionService = {
  /**
   * Copies cargo permissions (cargo_permissoes) into usuario_permissoes for the given user.
   */
  async syncPermissionsForUserFromCargo(userId: number, cargoId: number | null) {
    if (!cargoId) return;
    const cargoPerms = await prisma.cargoPermissao.findMany({ where: { cargoId } });
    for (const cp of cargoPerms) {
      const exists = await prisma.usuarioPermissao.findFirst({ where: { usuarioId: userId, permissaoId: cp.permissaoId } });
      if (!exists) {
        await prisma.usuarioPermissao.create({ data: { usuarioId: userId, permissaoId: cp.permissaoId } });
      }
    }
  }
};

export default permissionService;
