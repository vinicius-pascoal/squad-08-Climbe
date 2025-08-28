import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: { body?: AnyZodObject; query?: AnyZodObject; params?: AnyZodObject; }) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.query) schema.query.parse(req.query);
      if (schema.params) schema.params.parse(req.params);
      next();
    } catch (e: any) {
      return res.status(400).json({ error: e.errors ?? 'Dados inválidos' });
    }
  };
}
