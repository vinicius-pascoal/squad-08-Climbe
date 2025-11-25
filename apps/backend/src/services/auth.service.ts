
import { usuarioRepo } from '../repositories/usuario.repo';
import { comparePassword, hashPassword } from '../utils/password';
import { signAccessToken } from './token.service';

const SITUACAO = { APROVADO: 'aprovado' } as const;

export const authService = {
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await usuarioRepo.findById(userId);
    if (!user || !user.senhaHash) {
      const e: any = new Error('Usuário não encontrado');
      e.statusCode = 404;
      throw e;
    }

    // Verifica se a senha atual está correta
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.senhaHash);
    if (!isCurrentPasswordValid) {
      const e: any = new Error('Senha atual incorreta');
      e.statusCode = 400;
      throw e;
    }

    // Verifica se a nova senha é diferente da atual
    const isSamePassword = await comparePassword(newPassword, user.senhaHash);
    if (isSamePassword) {
      const e: any = new Error('A nova senha deve ser diferente da senha atual');
      e.statusCode = 400;
      throw e;
    }

    // Hash da nova senha
    const newPasswordHash = await hashPassword(newPassword);

    // Atualiza a senha no banco
    await usuarioRepo.updatePassword(userId, newPasswordHash);

    return { message: 'Senha alterada com sucesso' };
  },

  async passwordGrant(username: string, password: string) {
    const user = await usuarioRepo.findByEmail(username);
    if (!user || !user.senhaHash) {
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
    const sit = (String(user.situacao || '')).toLowerCase();
    if (sit === 'desativado') {
      const e: any = new Error('Usuário desativado');
      e.statusCode = 403;
      throw e;
    }
    if (sit !== SITUACAO.APROVADO) {
      const e: any = new Error('Usuário pendente de aprovação');
      e.statusCode = 403;
      throw e;
    }
    const access_token = await signAccessToken(user.id);
    return {
      access_token,
      token_type: 'Bearer' as const,
      // Frontend only uses token; 30 min default (1800s). If you change env, adjust accordingly.
      expires_in: 1800,
      user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email },
    };
  },

  // Optional flow if frontend sends a Google access_token directly
  async googleAccessGrant(googleAccessToken: string) {
    // Fetch userinfo from Google
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    if (!res.ok) {
      const e: any = new Error('Token Google inválido');
      e.statusCode = 400;
      throw e;
    }
    const profile: any = await res.json();
    const email = String(profile.email || '').toLowerCase();
    const name = profile.name || profile.given_name || 'Usuário Google';

    if (!email) {
      const e: any = new Error('Google sem e-mail');
      e.statusCode = 400;
      throw e;
    }

    let user = await usuarioRepo.findByEmail(email);
    if (!user) {
      user = await usuarioRepo.create({
        email,
        nomeCompleto: name,
        situacao: 'pendente',
        senhaHash: '',
      } as any);
    }

    if ((String(user.situacao || '')).toLowerCase() !== SITUACAO.APROVADO) {
      const e: any = new Error('Usuário pendente de aprovação');
      e.statusCode = 403;
      throw e;
    }

    const access_token = await signAccessToken(user.id);
    return {
      access_token,
      token_type: 'Bearer' as const,
      expires_in: 1800,
      user: { id: user.id, nomeCompleto: user.nomeCompleto, email: user.email },
    };
  },
};
