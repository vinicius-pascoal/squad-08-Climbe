const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const env = process.env.JWT_SECRET || 'dev-secret';

(async () => {
  const p = new PrismaClient();
  try {
    const cargo = await p.cargo.findFirst({ where: { nomeCargo: 'Compliance' } });
    if (!cargo) {
      console.log('No Compliance cargo found');
      process.exit(1);
    }
    const user = await p.usuario.findFirst({ where: { cargoId: cargo.id } });
    if (!user) {
      console.log('No user with Compliance cargo found');
      process.exit(1);
    }

    const cargoPerms = await p.cargoPermissao.findMany({ where: { cargoId: cargo.id }, include: { permissao: true } });
    const userPerms = await p.usuarioPermissao.findMany({ where: { usuarioId: user.id }, include: { permissao: true } });
    const perms = Array.from(new Set([...(userPerms || []).map(u => u.permissao?.descricao).filter(Boolean), ...(cargoPerms || []).map(c => c.permissao?.descricao).filter(Boolean)]));

    const payload = { cargoId: cargo.id, cargoNome: cargo.nomeCargo, permissoes: perms };
    const token = jwt.sign(payload, env, { subject: String(user.id), expiresIn: '30m' });

    console.log('User:', { id: user.id, email: user.email });
    console.log('Token:', token);
    console.log('Payload:', payload);
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
