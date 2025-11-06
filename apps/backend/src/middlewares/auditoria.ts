import { Request, Response, NextFunction } from 'express';
import { auditoriaService } from '../services/auditoria.service';

// Estende a interface Request para incluir dados de auditoria
declare global {
  namespace Express {
    interface Request {
      auditoriaData?: {
        acao: string;
        entidade: string;
        entidadeId?: number;
        descricao?: string;
        dadosAntes?: any;
      };
    }
  }
}

/**
 * Middleware para registrar automaticamente auditorias após a resposta
 * Usa o método res.on('finish') para garantir que a resposta foi enviada com sucesso
 */
export function registrarAuditoria(entidade: string, acao?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Captura IP e User Agent
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');

    // Determina a ação baseada no método HTTP se não foi especificada
    let acaoFinal = acao;
    if (!acaoFinal) {
      switch (req.method) {
        case 'POST':
          acaoFinal = 'Criar';
          break;
        case 'PUT':
        case 'PATCH':
          acaoFinal = 'Atualizar';
          break;
        case 'DELETE':
          acaoFinal = 'Deletar';
          break;
        default:
          acaoFinal = 'Visualizar';
      }
    }

    // Armazena os dados originais para comparação (para updates)
    const dadosOriginais = res.locals.dadosOriginais;

    // Hook após o envio da resposta
    res.on('finish', () => {
      // Só registra se a resposta foi bem-sucedida (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Executa de forma assíncrona sem bloquear
        setImmediate(async () => {
          try {
            const usuarioId = (req as any).user?.id || (req as any).userId;

            // Pega dados de auditoria customizados, se existirem
            const customData = req.auditoriaData;

            // Extrai entidadeId da resposta ou dos parâmetros
            let entidadeId = customData?.entidadeId ||
              res.locals.entidadeId ||
              (req.params.id ? parseInt(req.params.id) : undefined);

            // Para criações, tenta pegar o ID do corpo da resposta
            if (!entidadeId && res.locals.responseData?.id) {
              entidadeId = res.locals.responseData.id;
            }

            // Monta descrição
            let descricao = customData?.descricao;
            if (!descricao) {
              descricao = `${acaoFinal} ${entidade}${entidadeId ? ` #${entidadeId}` : ''}`;
            }

            // Prepara dados antes e depois
            let dadosAntes = customData?.dadosAntes || dadosOriginais;
            let dadosDepois = res.locals.responseData;

            console.log('[Auditoria] Registrando:', {
              usuarioId,
              acao: customData?.acao || acaoFinal,
              entidade: customData?.entidade || entidade,
              entidadeId,
              statusCode: res.statusCode
            });

            await auditoriaService.registrar({
              usuarioId,
              acao: customData?.acao || acaoFinal,
              entidade: customData?.entidade || entidade,
              entidadeId,
              descricao,
              ip,
              userAgent,
              dadosAntes: dadosAntes ? JSON.stringify(dadosAntes) : undefined,
              dadosDepois: dadosDepois ? JSON.stringify(dadosDepois) : undefined,
            });

            console.log('[Auditoria] Registrado com sucesso!');
          } catch (error) {
            // Log do erro mas não interrompe o fluxo
            console.error('[Auditoria] Erro ao registrar auditoria:', error);
          }
        });
      } else {
        console.log('[Auditoria] Não registrado - Status:', res.statusCode);
      }
    });

    next();
  };
}

/**
 * Middleware helper para armazenar dados antes da operação (útil para updates)
 */
export function capturarDadosOriginais(buscarDados: (req: Request) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dados = await buscarDados(req);
      res.locals.dadosOriginais = dados;
    } catch (error) {
      console.error('[Auditoria] Erro ao capturar dados originais:', error);
    }
    next();
  };
}

/**
 * Middleware helper para capturar resposta JSON
 * Use este wrapper nos controllers para armazenar dados da resposta
 */
export function enviarResposta(res: Response, statusCode: number, data: any) {
  res.locals.responseData = data;
  res.locals.entidadeId = data?.id;
  return res.status(statusCode).json(data);
}
