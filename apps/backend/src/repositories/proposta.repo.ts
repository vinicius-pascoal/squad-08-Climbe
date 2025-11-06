import { prisma } from '../utils/prisma';
import type { CreatePropostaDto, UpdatePropostaDto } from '../dtos/proposta.dto';

export const propostaRepo = {
  async create(data: CreatePropostaDto, usuarioId: number) {
    return await prisma.proposta.create({
      data: {
        empresaId: data.empresaId,
        usuarioId: usuarioId,
        status: data.status || 'PENDENTE',
        dataCriacao: new Date(),
      },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
          },
        },
      },
    });
  },

  async findAll() {
    return await prisma.proposta.findMany({
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
          },
        },
      },
      orderBy: {
        dataCriacao: 'desc',
      },
    });
  },

  async findById(id: number) {
    return await prisma.proposta.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            email: true,
            telefone: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
            email: true,
          },
        },
        contratos: {
          select: {
            id: true,
            nome: true,
            status: true,
            valor: true,
            dataInicio: true,
            dataFim: true,
          },
        },
      },
    });
  },

  async update(id: number, data: UpdatePropostaDto) {
    return await prisma.proposta.update({
      where: { id },
      data,
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
          },
        },
      },
    });
  },

  async delete(id: number) {
    return await prisma.proposta.delete({
      where: { id },
    });
  },

  async findByEmpresa(empresaId: number) {
    return await prisma.proposta.findMany({
      where: { empresaId },
      include: {
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
          },
        },
      },
      orderBy: {
        dataCriacao: 'desc',
      },
    });
  },

  async findByUsuario(usuarioId: number) {
    return await prisma.proposta.findMany({
      where: { usuarioId },
      include: {
        empresa: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
          },
        },
      },
      orderBy: {
        dataCriacao: 'desc',
      },
    });
  },
};
