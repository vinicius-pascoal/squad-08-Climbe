import { usuarioRepo } from '../repositories/usuario.repo';
import { RegisterDTO } from '../dtos/usuario.dto';
import { hashPassword } from '../utils/password';
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
      contato: input.contato ?? null,
      situacao: SITUACAO.PENDENTE,
      senhaHash,
    } as any);
  },

  async aprovar(id: number) {
    const user = await usuarioRepo.findById(id);
    if (!user) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 });
    return usuarioRepo.update(id, { situacao: SITUACAO.APROVADO });
  },

  list: () => usuarioRepo.list(),
  findById: (id: number) => usuarioRepo.findById(id),
  delete: (id: number) => usuarioRepo.delete(id),
};
