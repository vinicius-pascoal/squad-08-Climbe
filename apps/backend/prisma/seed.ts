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
    'Admin',
  ];

  // Garante cargos
  for (const nome of cargosBase) {
    await ensureCargo(nome);
  }

  // Usuário admin opcional (ativo) — edite conforme sua necessidade
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@climbe.local';
  const adminNome = process.env.SEED_ADMIN_NOME || 'Administrador';
  const adminCargoNome = process.env.SEED_ADMIN_CARGO || 'Admin';
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

  // Popula permissões e vínculos cargo_permissoes a partir da matriz fornecida
  async function seedPermissoesFromCsv() {
    const CSV = `a,Contratos — Visualizar,Contratos — Criar,Contratos — Editar,Contratos — Excluir,Contratos — Aplicar Nível de Complexidade,Contratos — Anexar Analista,Cargos/Perfis — Visualizar,Cargos/Perfis — Criar,Cargos/Perfis — Editar,Cargos/Perfis — Excluir,Docs Jurídicos — Visualizar,Docs Jurídicos — Criar,Docs Jurídicos — Editar,Docs Jurídicos — Excluir,Planilha Restrita — Solicitar Edição,Reuniões — Agendar,Relatórios — Visualizar,Relatórios — Criar,Relatórios — Editar,Relatórios — Excluir,Arquivos — Upload,Arquivos — Download,Usuários — Aceitar/Aprovar,Usuários — Excluir,Sistema — Acesso a Logs,Propostas Comerciais — Criar,Propostas Comerciais — Validar,Tarefas — Acesso (total/leitura/—),Observações / Restrições de Escopo
ADMIN,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,total,—
Compliance,SIM,SIM,SIM,SIM,NÃO,NÃO,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,NÃO,NÃO,NÃO,SIM,SIM,SIM,SIM,NÃO,NÃO,NÃO,leitura,Sem acesso a Logs; não pode excluir usuários; não pode anexar analista.
CEO,SIM,NÃO,NÃO,NÃO,SIM,NÃO,SIM,SIM,SIM,SIM,SIM,NÃO,NÃO,NÃO,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,NÃO,SIM,SIM,leitura,Perfil executivo; sem criação de contratos/propostas.
Membro do Conselho,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,NÃO,—,Sem acessos adicionais.
CSO,SIM,NÃO,NÃO,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,SIM,NÃO,leitura,Uploads/Downloads relacionados a propostas.
CMO,SIM,NÃO,NÃO,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,SIM,NÃO,leitura,Uploads/Downloads relacionados a propostas.
CFO,SIM,NÃO,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,NÃO,SIM,SIM,SIM,SIM,SIM,SIM,SIM,NÃO,NÃO,NÃO,SIM,SIM,leitura,Pode validar proposta comercial e anexar analista a contrato.
Analista de Valores,SIM,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,NÃO,NÃO,NÃO,NÃO,NÃO,total,Somente contratos vinculados (ACL/ownership).
Analista de BPO,SIM,NÃO,NÃO,NÃO,SIM,SIM,NÃO,NÃO,NÃO,NÃO,SIM,NÃO,NÃO,NÃO,SIM,SIM,SIM,SIM,SIM,SIM,SIM,SIM,NÃO,NÃO,NÃO,NÃO,NÃO,total,Somente contratos vinculados (ACL/ownership).`;

    function parseCSV(text: string) {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const header = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(',').map(c => c.trim()));
      return { header, rows };
    }

    const { header, rows } = parseCSV(CSV);
    const permHeaders = header.slice(1);

    // create permissoes
    const permMap: Record<string, number> = {};
    for (const descricao of permHeaders) {
      const p = await prisma.permissao.findFirst({ where: { descricao } });
      if (p) { permMap[descricao] = p.id; continue; }
      const created = await prisma.permissao.create({ data: { descricao } });
      permMap[descricao] = created.id;
    }

    const cargos = await prisma.cargo.findMany();
    function matchCargo(csvName: string) {
      const low = csvName.toLowerCase();
      const foundExact = cargos.find((c: any) => c.nomeCargo.toLowerCase() === low);
      if (foundExact) return foundExact.id;
      const special: Record<string, string> = {
        'admin': 'Admin',
        'analista de valores': 'Analista de Valores Imobiliários',
        'analista de bpo': 'Analista de BPO Financeiro'
      };
      if (special[low]) {
        const f = cargos.find((c: any) => c.nomeCargo.toLowerCase() === special[low].toLowerCase());
        if (f) return f.id;
      }
      const f = cargos.find((c: any) => c.nomeCargo.toLowerCase().includes(low) || low.includes(c.nomeCargo.toLowerCase()));
      return f ? f.id : null;
    }

    for (const row of rows) {
      const csvCargo = row[0];
      if (!csvCargo) continue;
      const cargoId = matchCargo(csvCargo);
      if (!cargoId) { console.warn('Cargo não encontrado para:', csvCargo); continue; }

      for (let i = 1; i < row.length; i++) {
        const cell = row[i] || '';
        const has = cell.toUpperCase() === 'SIM';
        if (!has) continue;
        const permissaoDesc = permHeaders[i - 1];
        const permissaoId = permMap[permissaoDesc];
        if (!permissaoId) continue;

        const exists = await prisma.cargoPermissao.findFirst({ where: { cargoId, permissaoId } });
        if (!exists) await prisma.cargoPermissao.create({ data: { cargoId, permissaoId } });

        const users = await prisma.usuario.findMany({ where: { cargoId } });
        for (const u of users) {
          const up = await prisma.usuarioPermissao.findFirst({ where: { usuarioId: u.id, permissaoId } });
          if (!up) await prisma.usuarioPermissao.create({ data: { usuarioId: u.id, permissaoId } });
        }
      }
    }
    console.log('Seed de permissões concluído.');
  }

  // Tenta rodar o seed de permissões (não falha o seed principal)
  try { await seedPermissoesFromCsv(); } catch (e) { console.warn('Falha ao popular permissoes:', (e as Error).message); }

  // Garantir permissão explícita de 'Usuários — Criar' para compatibilidade com frontend
  try {
    const descricaoCriar = 'Usuários — Criar';
    let permCriar = await prisma.permissao.findFirst({ where: { descricao: descricaoCriar } });
    if (!permCriar) permCriar = await prisma.permissao.create({ data: { descricao: descricaoCriar } });

    // Atribuir ao cargo Admin
    const adminCargo = await prisma.cargo.findFirst({ where: { nomeCargo: 'Admin' } });
    if (adminCargo) {
      const existsLink = await prisma.cargoPermissao.findFirst({ where: { cargoId: adminCargo.id, permissaoId: permCriar.id } });
      if (!existsLink) await prisma.cargoPermissao.create({ data: { cargoId: adminCargo.id, permissaoId: permCriar.id } });

      // Copiar para usuários existentes com cargo Admin
      const adminUsers = await prisma.usuario.findMany({ where: { cargoId: adminCargo.id } });
      for (const u of adminUsers) {
        const up = await prisma.usuarioPermissao.findFirst({ where: { usuarioId: u.id, permissaoId: permCriar!.id } });
        if (!up) await prisma.usuarioPermissao.create({ data: { usuarioId: u.id, permissaoId: permCriar.id } });
      }
    }
    console.log("Garantida permissão 'Usuários — Criar' para Admin");
  } catch (e) {
    console.warn('Falha ao garantir permissão Usuarios — Criar:', (e as Error).message);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
