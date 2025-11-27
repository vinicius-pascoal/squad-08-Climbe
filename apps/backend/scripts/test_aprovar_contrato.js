const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simular o flowService.advance
async function advanceFlow(flowId, nextScheduledAt) {
  console.log(`🔄 [advanceFlow] Iniciando avanço do flow ${flowId}`);

  const flow = await prisma.contractFlow.findUnique({
    where: { id: flowId },
    include: { steps: true }
  });

  if (!flow) {
    console.error(`❌ [advanceFlow] Fluxo ${flowId} não encontrado`);
    throw new Error('Fluxo não encontrado');
  }

  console.log(`📋 [advanceFlow] Flow ${flowId} encontrado, status: ${flow.status}`);
  const ordered = ['REUNIAO', 'PROPOSTA', 'CONTRATO', 'CRIACAO_EMPRESA'];
  const steps = flow.steps.sort((a, b) => ordered.indexOf(a.type) - ordered.indexOf(b.type));
  console.log(`📋 [advanceFlow] Steps ordenadas:`, steps.map(s => ({ type: s.type, status: s.status })));

  const current = steps.find(s => s.status === 'PENDENTE');
  console.log(`📋 [advanceFlow] Etapa PENDENTE atual:`, current ? { type: current.type, id: current.id } : 'Nenhuma');

  return prisma.$transaction(async (tx) => {
    if (!current) {
      console.error(`❌ [advanceFlow] Nenhuma etapa pendente encontrada no flow ${flowId}`);
      throw new Error('Nenhuma etapa pendente encontrada');
    }

    console.log(`✅ [advanceFlow] Marcando etapa ${current.type} como CONCLUIDO`);
    await tx.contractFlowStep.update({
      where: { id: current.id },
      data: { status: 'CONCLUIDO', completedAt: new Date() }
    });

    const curIdx = ordered.indexOf(current.type);
    console.log(`📋 [advanceFlow] Índice da etapa atual (${current.type}): ${curIdx}`);

    if (curIdx >= 0 && curIdx < ordered.length - 1) {
      const nextType = ordered[curIdx + 1];
      console.log(`📋 [advanceFlow] Próxima etapa será: ${nextType}`);

      const nextStep = steps.find(s => s.type === nextType);
      if (nextStep) {
        console.log(`✅ [advanceFlow] Ativando etapa ${nextType} (id: ${nextStep.id})`);
        const updated = await tx.contractFlowStep.update({
          where: { id: nextStep.id },
          data: { status: 'PENDENTE', scheduledAt: nextScheduledAt ?? null },
        });
        console.log(`✅ [advanceFlow] Etapa ${nextType} ativada com sucesso`);
        return updated;
      } else {
        console.warn(`⚠️ [advanceFlow] Próxima etapa ${nextType} não encontrada`);
      }
    } else {
      console.log(`🏁 [advanceFlow] Última etapa concluída, marcando flow como CONCLUIDO`);
      await tx.contractFlow.update({ where: { id: flowId }, data: { status: 'CONCLUIDO' } });
      return { done: true };
    }

    return { done: true };
  });
}

async function testAprovarContrato() {
  try {
    // Buscar um contrato aprovado com flow vinculado
    const contratoId = 'CTR-teste drive/fluxo 02';

    console.log(`🔍 Buscando flow para contrato ${contratoId}...\n`);

    const flow = await prisma.contractFlow.findFirst({
      where: { contratoId: contratoId },
      include: { steps: { orderBy: { id: 'asc' } } }
    });

    if (flow) {
      console.log(`✅ Flow encontrado:`, {
        flowId: flow.id,
        status: flow.status,
        steps: flow.steps.map(s => ({ id: s.id, type: s.type, status: s.status }))
      });

      const contratoStep = flow.steps.find(s => s.type === 'CONTRATO' && s.status === 'PENDENTE');

      if (contratoStep) {
        console.log(`\n✅ Etapa CONTRATO PENDENTE encontrada (id: ${contratoStep.id})`);
        console.log(`🚀 Avançando flow ${flow.id}...\n`);

        const result = await advanceFlow(flow.id);

        console.log(`\n✅ Flow avançado com sucesso!`);
        console.log(`Resultado:`, result);

        // Verificar o estado final
        console.log(`\n📋 Verificando estado final do flow...\n`);
        const finalFlow = await prisma.contractFlow.findUnique({
          where: { id: flow.id },
          include: { steps: { orderBy: { id: 'asc' } } }
        });

        console.log(`Estado final do Flow #${finalFlow.id}:`);
        console.log(`  Status: ${finalFlow.status}`);
        console.log(`  Etapas:`);
        finalFlow.steps.forEach(s => {
          console.log(`    - ${s.type}: ${s.status}`);
        });

      } else {
        console.log(`⚠️ Etapa CONTRATO não está PENDENTE`);
        console.log(`Status das etapas:`, flow.steps.map(s => `${s.type}: ${s.status}`).join(', '));
      }
    } else {
      console.log(`❌ Nenhum flow encontrado para contrato ${contratoId}`);
    }

  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testAprovarContrato();
