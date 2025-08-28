import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, aprovarSchema } from '../dtos/usuario.dto';
import { requireAuth } from '../middlewares/auth';

export const usuarioRouter = Router();

<<<<<<< Updated upstream
usuarioRouter.get('/', requireAuth, usuarioController.list);
usuarioRouter.get('/:id', requireAuth, usuarioController.getById);

usuarioRouter.post(
  '/register',
  validate({ body: registerSchema }),
  usuarioController.register
);

// endpoint administrativo (ex.: protegê-lo com requireAuth + checagem de permissão)
usuarioRouter.patch(
  '/:id/aprovar',
  requireAuth,
  validate({ params: aprovarSchema }),
  usuarioController.aprovar
);

=======
usuarioRouter.post('/register', validate({ body: registerSchema }), usuarioController.register);
usuarioRouter.patch('/:id/aprovar', requireAuth, validate({ params: aprovarSchema }), usuarioController.aprovar);

usuarioRouter.get('/', requireAuth, usuarioController.list);
usuarioRouter.get('/:id', requireAuth, usuarioController.getById);
>>>>>>> Stashed changes
usuarioRouter.delete('/:id', requireAuth, usuarioController.remove);
