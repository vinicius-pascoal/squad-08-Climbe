/**
 * Script para criar uma empresa de exemplo no banco de dados
 * Execute: node scripts/criar_empresa_exemplo.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function criarEmpresaExemplo() {
  try {
    console.log('🏢 Criando empresa de exemplo...\n');

    // Dados da empresa
    const empresaData = {
      razaoSocial: 'Tech Solutions Inovação Ltda',
      nomeFantasia: 'TechSolutions',
      cnpj: '11.222.333/0001-81',
      logradouro: 'Avenida Paulista',
      numero: '1578',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-200',
      telefone: '(11) 3456-7890',
      email: 'contato@techsolutions.com.br',
      representanteCpf: '111.444.777-35',
      representanteContato: '(11) 98765-4321',
    };

    console.log('📋 Dados da empresa:');
    console.log(JSON.stringify(empresaData, null, 2));
    console.log('');

    // Verificar se já existe
    const existente = await prisma.empresa.findFirst({
      where: { cnpj: empresaData.cnpj }
    });

    if (existente) {
      console.log(`⚠️  Empresa com CNPJ ${empresaData.cnpj} já existe!`);
      console.log(`   ID: ${existente.id}`);
      console.log(`   Nome: ${existente.nomeFantasia || existente.razaoSocial}`);
      return existente;
    }

    // Criar empresa
    const empresa = await prisma.empresa.create({
      data: empresaData
    });

    console.log('✅ Empresa criada com sucesso!');
    console.log(`   ID: ${empresa.id}`);
    console.log(`   Razão Social: ${empresa.razaoSocial}`);
    console.log(`   Nome Fantasia: ${empresa.nomeFantasia}`);
    console.log(`   CNPJ: ${empresa.cnpj}`);
    console.log('');

    return empresa;

  } catch (error) {
    console.error('❌ Erro ao criar empresa:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  criarEmpresaExemplo()
    .then(() => {
      console.log('✅ Script concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro:', error);
      process.exit(1);
    });
}

module.exports = { criarEmpresaExemplo };
