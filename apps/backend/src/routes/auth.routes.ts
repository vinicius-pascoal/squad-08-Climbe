import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { tokenSchema } from '../dtos/auth.dto';

export const authRouter = Router();
authRouter.post('/token', validate({ body: tokenSchema }), authController.token);
