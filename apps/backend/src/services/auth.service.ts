import { usuarioRepo } from '../repositories/usuario.repo';
import { comparePassword } from '../utils/password';
import { signAccessToken } from './token.service';

const SITUACAO = { APROVADO: 'aprovado' } as const;

export const authService = {
  async passwordGrant(username: string, password: string) {
    const user = await usuarioRepo.findByEmail(username);
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

  async googleAccessGrant(access_token: string) {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!response.ok) throw new Error('Falha ao carregar dados de usuário');

    const data = await response.json();
    const user = await usuarioRepo.findByEmail(data.email);
    if (!user) {
      const e: any = new Error('Credenciais inválidas');
      e.statusCode = 400;
      throw e;
    }
    
    if ((user.situacao || '').toLowerCase() !== SITUACAO.APROVADO) {
      const e: any = new Error('Usuário pendente de aprovação');
      e.statusCode = 403;
      throw e;
    }
    const user_token = signAccessToken(user.id);
    return {
      user_token,
      token_type: 'Bearer',
      expires_in: 900,
      user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email },
    };
  }
};
