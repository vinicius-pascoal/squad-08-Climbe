const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testContratoFlow() {
  try {
    console.log('🔍 Verificando contratos e seus fluxos...\n');

    // 1. Listar todos os contratos
    const contratos = await prisma.contrato.findMany({
      select: {
        id: true,
        nome: true,
        status: true,
        propostaId: true,
      }
    });

    console.log(`📋 Total de contratos: ${contratos.length}`);
    contratos.forEach(c => {
      console.log(`  - ${c.id}: ${c.nome} (status: ${c.status}, propostaId: ${c.propostaId})`);
    });

    console.log('\n🔍 Verificando fluxos...\n');

    // 2. Listar todos os fluxos com suas etapas
    const flows = await prisma.contractFlow.findMany({
      include: {
        steps: {
          orderBy: { id: 'asc' }
        },
        empresa: true,
      }
    });

    console.log(`📋 Total de fluxos: ${flows.length}\n`);

    for (const flow of flows) {
      console.log(`\n🔄 Flow #${flow.id}:`);
      console.log(`   Empresa: ${flow.empresa?.nomeFantasia || flow.empresa?.razaoSocial || 'N/A'}`);
      console.log(`   Status: ${flow.status}`);
      console.log(`   PropostaId: ${flow.propostaId || 'N/A'}`);
      console.log(`   ContratoId: ${flow.contratoId || 'N/A'}`);
      console.log(`   Etapas:`);

      flow.steps.forEach(step => {
        console.log(`     - ${step.type}: ${step.status} (id: ${step.id})`);
      });

      // Se tem contratoId, buscar o contrato
      if (flow.contratoId) {
        const contrato = await prisma.contrato.findUnique({
          where: { id: flow.contratoId }
        });

        if (contrato) {
          console.log(`   ✅ Contrato vinculado: ${contrato.nome} (status: ${contrato.status})`);
        } else {
          console.log(`   ❌ ERRO: ContratoId ${flow.contratoId} não encontrado no banco!`);
        }
      }
    }

    console.log('\n\n🔍 Verificando relação inversa (contratos sem fluxo)...\n');

    // 3. Verificar contratos que não têm fluxo associado
    for (const contrato of contratos) {
      const flow = await prisma.contractFlow.findFirst({
        where: { contratoId: contrato.id }
      });

      if (!flow) {
        console.log(`⚠️  Contrato ${contrato.id} (${contrato.nome}) não tem fluxo associado`);
      }
    }

    console.log('\n✅ Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testContratoFlow();
