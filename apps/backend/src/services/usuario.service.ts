import { usuarioRepo } from '../repositories/usuario.repo';
import { RegisterDTO, AprovarDTO } from '../dtos/usuario.dto';
import { hashPassword } from '../utils/password';
import { prisma } from '../utils/prisma';

const SITUACAO = { PENDENTE: 'pendente', APROVADO: 'aprovado' } as const;

export const usuarioService = {
  async register(input: RegisterDTO) {
    // verifica e-mail único
    const exists = await usuarioRepo.findByEmail(input.email);
    if (exists) {
      const e: any = new Error('E-mail já cadastrado');
      e.statusCode = 409;
      throw e;
    }
    const senhaHash = await hashPassword(input.senha);
    const created = await usuarioRepo.create({
      nomeCompleto: input.nomeCompleto,
      cargo: undefined,     // cargo será definido na aprovação
      cargoId: null,
      email: input.email.toLowerCase(),
      contato: input.contato ?? null,
      situacao: SITUACAO.PENDENTE,
      senhaHash,
      propostas: { create: [] }, // noop
      notificacoes: { create: [] }, // noop
      participantes: { create: [] }, // noop
      documentosAnalista: { create: [] }, // noop
      usuarioPermissoes: { create: [] }, // noop
    } as any);
    return created;
  },

  async aprovar(input: AprovarDTO) {
    const { id, cargoId } = input;
    // valida cargo
    const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
    if (!cargo) {
      const e: any = new Error('Cargo inválido');
      e.statusCode = 400;
      throw e;
    }
    // valida usuário
    const user = await usuarioRepo.findById(id);
    if (!user) {
      const e: any = new Error('Usuário não encontrado');
      e.statusCode = 404;
      throw e;
    }
    return usuarioRepo.update(id, { situacao: SITUACAO.APROVADO, cargoId });
  },

  list: () => usuarioRepo.list(),
  findById: (id: number) => usuarioRepo.findById(id),
  delete: (id: number) => usuarioRepo.delete(id),
};
