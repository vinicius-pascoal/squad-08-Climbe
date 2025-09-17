export type EmailTemplateType = 'boas-vindas' | 'atualizacao-contrato';

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
};
