import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const userId = (req as any).userId as number | undefined;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { cargo: true, usuarioPermissoes: { include: { permissao: true } } },
  });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  // gather permissions from usuario_permissoes and cargo_permissoes
  const userPerms = (user.usuarioPermissoes || []).map((u: any) => u.permissao?.descricao).filter(Boolean);
  const cargoPerms = user.cargoId
    ? (await prisma.cargoPermissao.findMany({ where: { cargoId: user.cargoId }, include: { permissao: true } })).map((c: any) => c.permissao?.descricao).filter(Boolean)
    : [];

  const perms = Array.from(new Set([...userPerms, ...cargoPerms]));

  return res.json({ id: user.id, nomeCompleto: user.nomeCompleto, email: user.email, cargoId: user.cargoId, cargoNome: user.cargo?.nomeCargo ?? null, permissoes: perms });
});

export default router;
