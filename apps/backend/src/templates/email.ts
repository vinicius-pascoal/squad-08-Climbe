export type EmailTemplateType = 'boas-vindas' | 'atualizacao-contrato' | 'fluxo-contrato-step';

type TemplateFn = (data?: Record<string, any>) => { subject: string; html: string; text: string };

const asText = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const templates: Record<EmailTemplateType, TemplateFn> = {
  'boas-vindas': (data = {}) => {
    const nome = data.nome || 'usuário';
    const cargo = data.cargo || '';
    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Bem-vindo(a), ${nome}!</h2>
        <p>Seu acesso foi aprovado${cargo ? ` para o cargo <b>${cargo}</b>` : ''}.</p>
        <p>Você já pode acessar o sistema e começar a usar.</p>
      </div>`;
    return { subject: 'Bem-vindo(a) à Climbe', html, text: asText(html) };
  },

  'atualizacao-contrato': (data = {}) => {
    const empresa = data.empresa || 'sua empresa';
    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Atualização de contrato</h2>
        <p>Houve uma atualização no contrato da ${empresa}. Acesse o portal para conferir os detalhes.</p>
      </div>`;
    return { subject: 'Atualização de contrato', html, text: asText(html) };
  },
  'fluxo-contrato-step': (data = {}) => {
    const etapa = data.etapa || 'Etapa';
    const empresa = data.empresa || 'sua empresa';
    const quando = data.quando ? new Date(data.quando).toLocaleString('pt-BR') : null;
    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Fluxo de contrato — ${etapa}</h2>
        <p>Uma nova etapa do fluxo de contrato da ${empresa} foi iniciada: <b>${etapa}</b>.</p>
        ${quando ? `<p>Agendado para: <b>${quando}</b></p>` : ''}
        <p>Acesse o sistema para ver os detalhes.</p>
      </div>`;
    return { subject: `Fluxo de contrato — ${etapa}`, html, text: asText(html) };
  },
};
