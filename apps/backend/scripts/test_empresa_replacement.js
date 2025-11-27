/**
 * Script para testar a substituição da empresa temporária
 * 
 * Este script:
 * 1. Cria um fluxo sem empresaId (criando empresa temporária)
 * 2. Vincula uma proposta ao fluxo
 * 3. Cria uma empresa real
 * 4. Atualiza o fluxo com a empresa real
 * 5. Verifica se proposta, reunião e fluxo foram atualizados
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEmpresaReplacement() {
  try {
    console.log('=== Iniciando teste de substituição de empresa temporária ===\n');

    // 1. Criar fluxo sem empresaId (cria empresa temporária)
    console.log('1. Criando fluxo sem empresaId...');

    // Buscar um usuário existente
    const usuario = await prisma.usuario.findFirst();
    if (!usuario) {
      throw new Error('Nenhum usuário encontrado no banco');
    }
    console.log(`   Usuário encontrado: ${usuario.nomeCompleto} (ID: ${usuario.id})`);

    // Criar empresa temporária manualmente (simular o que o flowRepo.createFlow faz)
    const empresaTemp = await prisma.empresa.create({
      data: {
        razaoSocial: 'Empresa Temporária - Teste Script',
        nomeFantasia: 'Temp Test',
        cnpj: '00000000000000',
        email: 'temp@test.com',
        telefone: '11111111111',
      },
    });
    console.log(`   Empresa temporária criada: ID ${empresaTemp.id}\n`);

    // Criar fluxo com empresa temporária
    const flow = await prisma.contractFlow.create({
      data: {
        empresaId: empresaTemp.id,
        iniciadorId: usuario.id,
        nome: 'Teste Substituição Empresa',
        status: 'EM_PROGRESSO',
        steps: {
          create: [
            { type: 'REUNIAO', status: 'CONCLUIDO' },
            { type: 'PROPOSTA', status: 'CONCLUIDO' },
            { type: 'CONTRATO', status: 'CONCLUIDO' },
            { type: 'CRIACAO_EMPRESA', status: 'EM_PROGRESSO' },
          ],
        },
        participantes: {
          create: { usuarioId: usuario.id },
        },
      },
      include: {
        empresa: true,
        steps: true,
      },
    });
    console.log(`   Fluxo criado: ID ${flow.id}`);
    console.log(`   Empresa do fluxo: ${flow.empresa.razaoSocial} (CNPJ: ${flow.empresa.cnpj})\n`);

    // 2. Criar uma proposta vinculada à empresa temporária
    console.log('2. Criando proposta vinculada à empresa temporária...');
    const proposta = await prisma.proposta.create({
      data: {
        empresaId: empresaTemp.id,
        usuarioId: usuario.id,
        status: 'APROVADA',
        dataCriacao: new Date(),
      },
    });
    console.log(`   Proposta criada: ID ${proposta.id}\n`);

    // Vincular proposta ao fluxo
    await prisma.contractFlow.update({
      where: { id: flow.id },
      data: { propostaId: proposta.id },
    });
    console.log(`   Proposta vinculada ao fluxo\n`);

    // 3. Criar uma reunião vinculada à empresa temporária
    console.log('3. Criando reunião vinculada à empresa temporária...');
    const reuniao = await prisma.reuniao.create({
      data: {
        empresaId: empresaTemp.id,
        data: new Date(),
        hora: new Date(),
        titulo: 'Reunião de Teste',
        participantes: {
          create: { usuarioId: usuario.id },
        },
      },
    });
    console.log(`   Reunião criada: ID ${reuniao.id}\n`);

    // 4. Criar empresa real
    console.log('4. Criando empresa real...');
    const empresaReal = await prisma.empresa.create({
      data: {
        razaoSocial: 'Empresa Real Ltda',
        nomeFantasia: 'Empresa Real',
        cnpj: '11222333000181', // CNPJ válido
        email: 'contato@empresareal.com',
        telefone: '11987654321',
      },
    });
    console.log(`   Empresa real criada: ID ${empresaReal.id}`);
    console.log(`   Razão Social: ${empresaReal.razaoSocial}`);
    console.log(`   CNPJ: ${empresaReal.cnpj}\n`);

    // 5. Atualizar o fluxo com a empresa real (simulando o método updateEmpresa)
    console.log('5. Substituindo empresa temporária pela empresa real...');

    // Simular o método flowRepo.updateEmpresa com a lógica de transação
    await prisma.$transaction(async (tx) => {
      // Buscar o fluxo para obter informações da empresa temporária
      const flowData = await tx.contractFlow.findUnique({
        where: { id: flow.id },
        include: { empresa: true },
      });

      if (!flowData) {
        throw new Error(`Fluxo com ID ${flow.id} não encontrado`);
      }

      const empresaTemporariaId = flowData.empresaId;
      const isTemporaryCompany = flowData.empresa?.cnpj === '00000000000000';

      console.log('   Informações do fluxo:', {
        flowId: flow.id,
        empresaTemporariaId,
        novaEmpresaId: empresaReal.id,
        isTemporaryCompany,
      });

      // Atualizar o fluxo com a nova empresa
      await tx.contractFlow.update({
        where: { id: flow.id },
        data: { empresaId: empresaReal.id },
      });
      console.log('   Fluxo atualizado');

      // Se havia uma empresa temporária, atualizar proposta e reunião
      if (isTemporaryCompany && empresaTemporariaId) {
        console.log('   Substituindo empresa temporária em entidades relacionadas...');

        // Atualizar a proposta vinculada ao fluxo
        if (flowData.propostaId) {
          await tx.proposta.update({
            where: { id: flowData.propostaId },
            data: { empresaId: empresaReal.id },
          });
          console.log('   Proposta atualizada:', flowData.propostaId);
        }

        // Atualizar as reuniões da empresa temporária
        const reunioesAtualizadas = await tx.reuniao.updateMany({
          where: { empresaId: empresaTemporariaId },
          data: { empresaId: empresaReal.id },
        });
        console.log('   Reuniões atualizadas:', reunioesAtualizadas.count);

        // Marcar a empresa temporária como obsoleta
        await tx.empresa.update({
          where: { id: empresaTemporariaId },
          data: {
            razaoSocial: `[OBSOLETA] ${flowData.empresa.razaoSocial}`,
          },
        });
        console.log('   Empresa temporária marcada como obsoleta:', empresaTemporariaId);
      }
    });

    console.log(`   Fluxo atualizado com sucesso!\n`);

    // 6. Verificar se tudo foi atualizado corretamente
    console.log('6. Verificando atualizações...\n');

    // Verificar fluxo
    const flowAtualizado = await prisma.contractFlow.findUnique({
      where: { id: flow.id },
      include: { empresa: true },
    });
    console.log(`   Fluxo ${flow.id}:`);
    console.log(`   - Empresa atual: ${flowAtualizado.empresa.razaoSocial} (ID: ${flowAtualizado.empresaId})`);
    console.log(`   - ✓ ${flowAtualizado.empresaId === empresaReal.id ? 'CORRETO' : 'ERRO'}\n`);

    // Verificar proposta
    const propostaAtualizada = await prisma.proposta.findUnique({
      where: { id: proposta.id },
      include: { empresa: true },
    });
    console.log(`   Proposta ${proposta.id}:`);
    console.log(`   - Empresa atual: ${propostaAtualizada.empresa.razaoSocial} (ID: ${propostaAtualizada.empresaId})`);
    console.log(`   - ✓ ${propostaAtualizada.empresaId === empresaReal.id ? 'CORRETO' : 'ERRO'}\n`);

    // Verificar reunião
    const reuniaoAtualizada = await prisma.reuniao.findUnique({
      where: { id: reuniao.id },
      include: { empresa: true },
    });
    console.log(`   Reunião ${reuniao.id}:`);
    console.log(`   - Empresa atual: ${reuniaoAtualizada.empresa.razaoSocial} (ID: ${reuniaoAtualizada.empresaId})`);
    console.log(`   - ✓ ${reuniaoAtualizada.empresaId === empresaReal.id ? 'CORRETO' : 'ERRO'}\n`);

    // Verificar empresa temporária
    const empresaTempAtualizada = await prisma.empresa.findUnique({
      where: { id: empresaTemp.id },
    });
    console.log(`   Empresa temporária ${empresaTemp.id}:`);
    console.log(`   - Razão Social: ${empresaTempAtualizada.razaoSocial}`);
    console.log(`   - ✓ ${empresaTempAtualizada.razaoSocial.includes('[OBSOLETA]') ? 'MARCADA COMO OBSOLETA' : 'NÃO MARCADA'}\n`);

    console.log('=== Teste concluído com sucesso! ===\n');

    // Resumo
    const success =
      flowAtualizado.empresaId === empresaReal.id &&
      propostaAtualizada.empresaId === empresaReal.id &&
      reuniaoAtualizada.empresaId === empresaReal.id &&
      empresaTempAtualizada.razaoSocial.includes('[OBSOLETA]');

    if (success) {
      console.log('✓ TODOS OS TESTES PASSARAM!');
      console.log('  - Fluxo atualizado com empresa real');
      console.log('  - Proposta atualizada com empresa real');
      console.log('  - Reunião atualizada com empresa real');
      console.log('  - Empresa temporária marcada como obsoleta');
    } else {
      console.log('✗ ALGUNS TESTES FALHARAM');
    }

    return success;

  } catch (error) {
    console.error('Erro durante o teste:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testEmpresaReplacement()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
