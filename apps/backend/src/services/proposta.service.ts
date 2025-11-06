import { propostaRepo } from '../repositories/proposta.repo';
import { empresaService } from './empresa.service';
import type { CreatePropostaDto, UpdatePropostaDto } from '../dtos/proposta.dto';

export const propostaService = {
  async createProposta(data: CreatePropostaDto, usuarioId: number) {
    // Validar se a empresa existe
    const empresa = await empresaService.findById(data.empresaId);
    if (!empresa) {
      throw new Error('Empresa não encontrada');
    }

    return await propostaRepo.create(data, usuarioId);
  },

  async getAllPropostas() {
    return await propostaRepo.findAll();
  },

  async getPropostaById(id: number) {
    const proposta = await propostaRepo.findById(id);
    if (!proposta) {
      throw new Error('Proposta não encontrada');
    }
    return proposta;
  },

  async updateProposta(id: number, data: UpdatePropostaDto) {
    // Verificar se a proposta existe
    const proposta = await propostaRepo.findById(id);
    if (!proposta) {
      throw new Error('Proposta não encontrada');
    }

    return await propostaRepo.update(id, data);
  },

  async deleteProposta(id: number) {
    // Verificar se a proposta existe
    const proposta = await propostaRepo.findById(id);
    if (!proposta) {
      throw new Error('Proposta não encontrada');
    }

    // Verificar se a proposta possui contratos associados
    if (proposta.contratos && proposta.contratos.length > 0) {
      throw new Error('Não é possível excluir uma proposta que possui contratos associados');
    }

    return await propostaRepo.delete(id);
  },

  async getPropostasByEmpresa(empresaId: number) {
    return await propostaRepo.findByEmpresa(empresaId);
  },

  async getPropostasByUsuario(usuarioId: number) {
    return await propostaRepo.findByUsuario(usuarioId);
  },

  async getHistorico(propostaId: number) {
    const proposta = await propostaRepo.findById(propostaId);
    if (!proposta) {
      throw new Error('Proposta não encontrada');
    }

    // Retornar histórico de contratos relacionados à proposta
    return {
      proposta: {
        id: proposta.id,
        status: proposta.status,
        dataCriacao: proposta.dataCriacao,
        empresa: proposta.empresa,
      },
      contratos: proposta.contratos || [],
    };
  },
};
