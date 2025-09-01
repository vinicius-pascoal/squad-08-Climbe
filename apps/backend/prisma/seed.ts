import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const cargos = [
    { nomeCargo: 'Compliance' },
    { nomeCargo: 'CEO' },
    { nomeCargo: 'Membro do Conselho' },
    { nomeCargo: 'CSO' },
    { nomeCargo: 'CMO' },
    { nomeCargo: 'CFO' },
    { nomeCargo: 'Analista de Valores Imobiliários' },
    { nomeCargo: 'Analista de BPO Financeiro' },
  ];

  for (const cargo of cargos) {
    await prisma.cargo.upsert({
      where: { nomeCargo: cargo.nomeCargo },
      update: {},
      create: cargo,
    });
  }
  console.log('Database seeded');
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
