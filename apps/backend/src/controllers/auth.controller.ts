import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { enviarResposta } from '../middlewares/auditoria';

export const authController = {
  async token(req: Request, res: Response) {
    const { username, password } = req.body;
    const result = await authService.passwordGrant(username, password);

    // Armazena informações customizadas para auditoria
    req.auditoriaData = {
      acao: 'Login',
      entidade: 'Usuario',
      entidadeId: result.user?.id,
      descricao: `Login realizado por ${username}`
    };

    return enviarResposta(res, 200, result);
  },
  async google(req: Request, res: Response) {
    const { access_token } = req.body;
    const result = await authService.googleAccessGrant(access_token);

    // Armazena informações customizadas para auditoria
    req.auditoriaData = {
      acao: 'Login Google',
      entidade: 'Usuario',
      entidadeId: result.user?.id,
      descricao: `Login Google realizado por ${result.user?.email || 'desconhecido'}`
    };

    return enviarResposta(res, 200, result);
  }
};
