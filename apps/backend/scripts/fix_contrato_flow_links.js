const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixContratoFlowLinks() {
  try {
    console.log('🔧 Iniciando correção dos vínculos entre contratos e fluxos...\n');

    // 1. Buscar fluxos sem contratoId mas com propostaId
    const flowsSemContrato = await prisma.contractFlow.findMany({
      where: {
        contratoId: null,
        propostaId: { not: null }
      },
      include: {
        steps: {
          orderBy: { id: 'asc' }
        }
      }
    });

    console.log(`📋 Fluxos sem contrato vinculado: ${flowsSemContrato.length}\n`);

    for (const flow of flowsSemContrato) {
      console.log(`\n🔄 Processando Flow #${flow.id} (PropostaId: ${flow.propostaId})...`);

      // Buscar contrato com a mesma propostaId
      const contrato = await prisma.contrato.findFirst({
        where: {
          propostaId: flow.propostaId
        },
        orderBy: {
          dataInicio: 'desc' // Pegar o mais recente
        }
      });

      if (contrato) {
        console.log(`   ✅ Contrato encontrado: ${contrato.id} (${contrato.nome})`);
        console.log(`   🔗 Vinculando contrato ao flow...`);

        await prisma.contractFlow.update({
          where: { id: flow.id },
          data: { contratoId: contrato.id }
        });

        console.log(`   ✅ Vínculo criado com sucesso!`);
      } else {
        console.log(`   ⚠️  Nenhum contrato encontrado com propostaId ${flow.propostaId}`);
      }
    }

    console.log('\n\n📊 Verificando resultado...\n');

    // Verificar resultado final
    const flowsAtualizados = await prisma.contractFlow.findMany({
      where: {
        contratoId: { not: null }
      },
      select: {
        id: true,
        contratoId: true,
        propostaId: true
      }
    });

    console.log(`✅ Fluxos com contrato vinculado: ${flowsAtualizados.length}`);
    flowsAtualizados.forEach(f => {
      console.log(`   - Flow #${f.id}: ContratoId=${f.contratoId}, PropostaId=${f.propostaId}`);
    });

    console.log('\n✅ Correção concluída!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixContratoFlowLinks();
