import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

<<<<<<< Updated upstream
export function validate(schema: { body?: AnyZodObject; query?: AnyZodObject; params?: AnyZodObject; }) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.query) schema.query.parse(req.query);
      if (schema.params) schema.params.parse(req.params);
      next();
    } catch (e: any) {
      return res.status(400).json({ error: e.errors ?? 'Dados inválidos' });
=======
export function validate(schema: { body?: AnyZodObject; params?: AnyZodObject; query?: AnyZodObject }) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.params) schema.params.parse(req.params);
      if (schema.query) schema.query.parse(req.query);
      next();
    } catch (e: any) {
      res.status(400).json({ error: e?.errors ?? 'Dados inválidos' });
>>>>>>> Stashed changes
    }
  };
}
