import { usuarioRepo } from '../repositories/usuario.repo';
import { comparePassword } from '../utils/password';
import { signAccessToken } from './token.service';
import { SITUACAO } from '../utils/constants';

export const authService = {
  async passwordGrant(username: string, password: string) {
    const user = await usuarioRepo.findByEmailOrCpf(username);
    if (!user) throw Object.assign(new Error('Credenciais inválidas'), { status: 400 });

    const ok = await comparePassword(password, user.senhaHash);
    if (!ok) throw Object.assign(new Error('Credenciais inválidas'), { status: 400 });

    if (user.situacao?.toLowerCase() !== SITUACAO.APROVADO) {
      throw Object.assign(new Error('Usuário pendente de aprovação'), { status: 403 });
    }

    const accessToken = signAccessToken(user.id);
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 900, // 15m em segundos (ajuste conforme env)
      user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email }
    };
  }
};
