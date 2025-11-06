const { PrismaClient } = require('@prisma/client');

(async () => {
  const p = new PrismaClient();

  try {
    const cargos = ['Admin', 'Compliance'];
    for (const nome of cargos) {
      const c = await p.cargo.findFirst({
        where: { nomeCargo: nome },
        include: { cargoPermissoes: { include: { permissao: true } } },
      });
      console.log('CARGO:', nome);
      if (!c) {
        console.log('  NOT FOUND');
        continue;
      }
      console.log('  cargoId=', c.id);
      console.log('  permissoes:', (c.cargoPermissoes || []).map((cp) => cp.permissao?.descricao));
    }

    const admins = await p.usuario.findMany({
      where: { email: { contains: 'admin' } },
      include: { usuarioPermissoes: { include: { permissao: true } }, cargo: true },
    });
    console.log('\nUSERS matching "admin"');
    console.log(JSON.stringify(admins, null, 2));
  } catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
  } finally {
    await p.$disconnect();
  }

  process.exit(0);
})();
