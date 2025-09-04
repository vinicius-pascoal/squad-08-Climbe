// apps/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureCargo(nomeCargo: string) {
  const found = await prisma.cargo.findFirst({ where: { nomeCargo } });
  if (found) return found;
  return prisma.cargo.create({ data: { nomeCargo } });
}

async function main() {
  const cargosBase = [
    'Compliance',
    'CEO',
    'Membro do Conselho',
    'CSO',
    'CMO',
    'CFO',
    'Analista de Valores Imobiliários',
    'Analista de BPO Financeiro',
  ];

  const cargos = await Promise.all(cargosBase.map(ensureCargo));
  const cargoCEO = cargos.find(c => c.nomeCargo === 'CEO') ?? await ensureCargo('CEO');

  const email = 'admin@climbe.local';
  const cpf = '123.456.789-00';
  const senhaHash = await bcrypt.hash('Admin@123', 10);

  const existing = await prisma.usuario.findFirst({
    where: { OR: [{ email }, { cpf }] },
  });

  if (!existing) {
    await prisma.usuario.create({
      data: {
        nomeCompleto: 'Administrador (Seed)',
        cargoId: cargoCEO.id,
        cpf,
        email,
        contato: '(00) 00000-0000',
        situacao: 'aprovado',
        senhaHash,
      },
    });
  }

  console.log('Seed finalizada com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
