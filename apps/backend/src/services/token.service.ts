import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../utils/prisma';

export async function signAccessToken(userId: number) {
  // Load user with cargo and explicit usuarioPermissoes
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: { cargo: true, usuarioPermissoes: { include: { permissao: true } } },
  });

  const cargoPerms = user?.cargoId
    ? await prisma.cargoPermissao.findMany({ where: { cargoId: user.cargoId }, include: { permissao: true } })
    : [];

  const userPerms = (user?.usuarioPermissoes || []).map((u: any) => u.permissao?.descricao).filter(Boolean);
  const cargoPermsDesc = (cargoPerms || []).map((c: any) => c.permissao?.descricao).filter(Boolean);
  const permissoes = Array.from(new Set([...userPerms, ...cargoPermsDesc]));

  const payload: any = {
    cargoId: user?.cargoId ?? null,
    cargoNome: user?.cargo?.nomeCargo ?? null,
    permissoes,
  };

  // Build typed options and secret to satisfy TypeScript overloads
  const secret: Secret = env.jwtSecret as Secret;
  const options: SignOptions = {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}
