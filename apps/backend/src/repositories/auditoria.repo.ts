import { prisma } from '../utils/prisma';
import { CreateAuditoriaDto, AuditoriaQueryDto } from '../dtos/auditoria.dto';

export const auditoriaRepository = {
  async create(data: CreateAuditoriaDto) {
    return await prisma.auditoria.create({
      data: {
        ...data,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  },

  async findAll(query: AuditoriaQueryDto) {
    const { entidade, usuarioId, dataInicio, dataFim, acao, page = 1, limit = 50 } = query;

    // Garante que page e limit são números
    const pageNum = typeof page === 'number' ? page : parseInt(String(page)) || 1;
    const limitNum = typeof limit === 'number' ? limit : parseInt(String(limit)) || 50;

    const where: any = {};

    if (entidade) {
      where.entidade = entidade;
    }

    if (usuarioId) {
      where.usuarioId = usuarioId;
    }

    if (acao) {
      where.acao = acao;
    }

    if (dataInicio || dataFim) {
      where.dataCriacao = {};
      if (dataInicio) {
        where.dataCriacao.gte = new Date(dataInicio);
      }
      if (dataFim) {
        const endDate = new Date(dataFim);
        endDate.setHours(23, 59, 59, 999);
        where.dataCriacao.lte = endDate;
      }
    }

    const skip = (pageNum - 1) * limitNum;

    const [registros, total] = await Promise.all([
      prisma.auditoria.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
        orderBy: {
          dataCriacao: 'desc',
        },
        skip,
        take: limitNum,
      }),
      prisma.auditoria.count({ where }),
    ]);

    return {
      registros,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  async findById(id: number) {
    return await prisma.auditoria.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  },

  async findByEntidade(entidade: string, entidadeId?: number) {
    const where: any = { entidade };

    if (entidadeId) {
      where.entidadeId = entidadeId;
    }

    return await prisma.auditoria.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        dataCriacao: 'desc',
      },
    });
  },
};
