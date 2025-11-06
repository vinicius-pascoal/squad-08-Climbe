import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export function requirePermission(descricao: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    let userId = (req as any).userId as number | undefined;
    const userEmail = (req as any).userEmail as string | undefined;

    // If userId not set but we have an authenticated Google email, try to resolve local user id
    if (!userId && userEmail) {
      try {
        const u = await prisma.usuario.findFirst({ where: { email: userEmail } });
        if (u?.id) userId = u.id;
      } catch (e) {
        // ignore lookup errors
      }
    }

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // First try token payload (populated by requireAuth when verifying internal JWT)
    const tokenPayload = (req as any).tokenPayload as any | undefined;
    if (tokenPayload) {
      const perms: string[] = Array.isArray(tokenPayload.permissoes) ? tokenPayload.permissoes : [];
      if (perms.includes(descricao)) return next();
      // shortcut: if token indicates cargoNome Admin, allow
      const cargoNome = tokenPayload.cargoNome as string | undefined;
      if (cargoNome && (cargoNome.toLowerCase() === 'admin' || cargoNome.toLowerCase() === 'administrator')) return next();
    }

    // Fallback to DB checks (in case token was not internal JWT)
    // check direct user permission
    const userHas = await prisma.usuarioPermissao.findFirst({ where: { usuarioId: userId }, include: { permissao: true } });
    if (userHas && userHas.permissao && userHas.permissao.descricao === descricao) return next();

    // check all user permissions for match
    const userPerms = await prisma.usuarioPermissao.findMany({ where: { usuarioId: userId }, include: { permissao: true } });
    if (userPerms.some((up: any) => up.permissao?.descricao === descricao)) return next();

    // check by cargo -> cargoPermissao
    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    if (user?.cargoId) {
      const cargoPerms = await prisma.cargoPermissao.findMany({ where: { cargoId: user.cargoId }, include: { permissao: true } });
      if (cargoPerms.some((cp: any) => cp.permissao?.descricao === descricao)) return next();
    }

    // optional debug info: expose minimal context to logs (do not leak internals to clients)
    console.warn(`Permission denied: userId=${userId} email=${userEmail} required='${descricao}'`);
    return res.status(403).json({ error: 'Forbidden' });
  };
}

export default requirePermission;
