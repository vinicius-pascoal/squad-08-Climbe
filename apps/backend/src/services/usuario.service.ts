import { usuarioRepo } from '../repositories/usuario.repo';
import { RegisterDTO } from '../dtos/usuario.dto';
import { hashPassword } from '../utils/password';
<<<<<<< Updated upstream
import { SITUACAO } from '../utils/constants';

export const usuarioService = {
  async register(input: RegisterDTO) {
    const senhaHash = await hashPassword(input.senha);
    const emailLower = input.email.toLowerCase();

    // garanta CPF armazenado com máscara ***ou*** normalize (aqui só garantimos lowercase de email)
    return usuarioRepo.create({
      nomeCompleto: input.nomeCompleto,
      cargoId: input.cargoId ?? null,
      cpf: input.cpf,
      email: emailLower,
=======

const SITUACAO = { PENDENTE: 'pendente', APROVADO: 'aprovado' } as const;

export const usuarioService = {
  async register(input: RegisterDTO) {
    const exists = await usuarioRepo.findByEmailOrCpf(input.email) || await usuarioRepo.findByEmailOrCpf(input.cpf);
    if (exists) {
      const e: any = new Error('CPF ou e-mail já cadastrado');
      e.statusCode = 409;
      throw e;
    }
    const senhaHash = await hashPassword(input.senha);
    const created = await usuarioRepo.create({
      nomeCompleto: input.nomeCompleto,
      cargoId: input.cargoId ?? null,
      cpf: input.cpf,
      email: input.email.toLowerCase(),
>>>>>>> Stashed changes
      contato: input.contato ?? null,
      situacao: SITUACAO.PENDENTE,
      senhaHash,
    } as any);
<<<<<<< Updated upstream
=======
    return created;
>>>>>>> Stashed changes
  },

  async aprovar(id: number) {
    const user = await usuarioRepo.findById(id);
<<<<<<< Updated upstream
    if (!user) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 });
=======
    if (!user) {
      const e: any = new Error('Usuário não encontrado');
      e.statusCode = 404;
      throw e;
    }
>>>>>>> Stashed changes
    return usuarioRepo.update(id, { situacao: SITUACAO.APROVADO });
  },

  list: () => usuarioRepo.list(),
  findById: (id: number) => usuarioRepo.findById(id),
  delete: (id: number) => usuarioRepo.delete(id),
};
