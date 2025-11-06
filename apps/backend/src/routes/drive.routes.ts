import { Router } from 'express';
import { driveController } from '../controllers/drive.controller';
import { requireAuth } from '../middlewares/auth';

export const driveRouter = Router();

// Protegido por auth; ajuste para checar perfil se necessário
driveRouter.post('/create', requireAuth, driveController.create);
driveRouter.put('/:id', requireAuth, driveController.update);
driveRouter.get('/:id', requireAuth, driveController.getById);