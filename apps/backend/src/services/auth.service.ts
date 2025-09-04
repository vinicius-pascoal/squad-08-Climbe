import { usuarioRepo } from '../repositories/usuario.repo';
import { comparePassword } from '../utils/password';
import { signAccessToken } from './token.service';

const SITUACAO = { APROVADO: 'aprovado' } as const;

export const authService = {
  async passwordGrant(username: string, password: string) {
    const user = await usuarioRepo.findByEmailOrCpf(username);
    if (!user) {
      const e: any = new Error('Credenciais inválidas');
      e.statusCode = 400;
      throw e;
    }
    const ok = await comparePassword(password, user.senhaHash);
    if (!ok) {
      const e: any = new Error('Credenciais inválidas');
      e.statusCode = 400;
      throw e;
    }
    if ((user.situacao || '').toLowerCase() !== SITUACAO.APROVADO) {
      const e: any = new Error('Usuário pendente de aprovação');
      e.statusCode = 403;
      throw e;
    }
    const access_token = signAccessToken(user.id);
    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 900,
      user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email },
    };
  },
};
