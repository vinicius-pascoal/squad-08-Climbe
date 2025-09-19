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

  // Garante cargos
  for (const nome of cargosBase) {
    await ensureCargo(nome);
  }

  // Usuário admin opcional (ativo) — edite conforme sua necessidade
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@climbe.local';
  const adminNome = process.env.SEED_ADMIN_NOME || 'Administrador';
  const adminCargoNome = process.env.SEED_ADMIN_CARGO || 'CEO';
  const adminSenha = process.env.SEED_ADMIN_SENHA || 'admin12345';

  const cargo = await ensureCargo(adminCargoNome);
  const senhaHash = await bcrypt.hash(adminSenha, 10);

  const exists = await prisma.usuario.findFirst({ where: { email: adminEmail } });
  if (!exists) {
    await prisma.usuario.create({
      data: {
        nomeCompleto: adminNome,
        email: adminEmail.toLowerCase(),
        contato: '—',
        situacao: 'aprovado',
        senhaHash,
        cargoId: cargo.id,
      },
    });
    console.log(`Admin criado: ${adminEmail} (${adminCargoNome})`);
  } else {
    console.log(`Admin já existe: ${adminEmail}`);
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
