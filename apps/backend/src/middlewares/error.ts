import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
<<<<<<< Updated upstream
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Erro interno';
=======
  const status = err?.statusCode || err?.status || 500;
  const message = err?.message || 'Erro interno';
>>>>>>> Stashed changes
  res.status(status).json({ error: message });
}
