import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, aprovarSchema } from '../dtos/usuario.dto';
import { requireAuth } from '../middlewares/auth';

export const usuarioRouter = Router();

usuarioRouter.post('/register', validate({ body: registerSchema }), usuarioController.register);
usuarioRouter.patch('/:id/aprovar', requireAuth, validate({ params: aprovarSchema }), usuarioController.aprovar);

usuarioRouter.get('/', requireAuth, usuarioController.list);
usuarioRouter.get('/:id', requireAuth, usuarioController.getById);
usuarioRouter.delete('/:id', requireAuth, usuarioController.remove);
