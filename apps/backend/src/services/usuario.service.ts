import { usuarioRepo } from '../repositories/usuario.repo';
import { RegisterDTO, AprovarDTO } from '../dtos/usuario.dto';
import { hashPassword } from '../utils/password';
import { prisma } from '../utils/prisma';
import { sendTemplate } from './email.service';

const SITUACAO = { PENDENTE: 'pendente', APROVADO: 'aprovado' } as const;

export const usuarioService = {
  async register(input: RegisterDTO) {
    const exists = await usuarioRepo.findByEmail(input.email);
    if (exists) {
      const e: any = new Error('E-mail já cadastrado');
      e.statusCode = 409;
      throw e;
    }
    const senhaHash = await hashPassword(input.senha);
    const created = await usuarioRepo.create({
      nomeCompleto: input.nomeCompleto,
      cargoId: null,
      email: input.email.toLowerCase(),
      contato: input.contato ?? null,
      situacao: SITUACAO.PENDENTE,
      senhaHash,
    } as any);
    return created;
  },

  async aprovar(input: AprovarDTO) {
    const { id, cargoId } = input;
    const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
    if (!cargo) {
      const e: any = new Error('Cargo inválido');
      e.statusCode = 400;
      throw e;
    }
    const user = await usuarioRepo.findById(id);
    if (!user) {
      const e: any = new Error('Usuário não encontrado');
      e.statusCode = 404;
      throw e;
    }
    const updated = await usuarioRepo.update(id, { situacao: SITUACAO.APROVADO, cargoId });

    try {
      await sendTemplate([updated.email], 'boas-vindas', { nome: updated.nomeCompleto, cargo: cargo.nomeCargo });
    } catch (err) {
      console.warn('Falha ao enviar e-mail de boas-vindas:', (err as Error).message);
    }
    return updated;
  },

  list: () => usuarioRepo.list(),
  findById: (id: number) => usuarioRepo.findById(id),
  delete: (id: number) => usuarioRepo.delete(id),
};
