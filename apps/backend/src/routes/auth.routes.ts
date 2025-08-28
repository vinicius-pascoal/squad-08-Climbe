import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { tokenSchema } from '../dtos/auth.dto';

export const authRouter = Router();

// OAuth2-like: token endpoint (password grant)
authRouter.post('/token', validate({ body: tokenSchema }), authController.token);
