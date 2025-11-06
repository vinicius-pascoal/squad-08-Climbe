import { Router } from 'express';
import { auditoriaController } from '../controllers/auditoria.controller';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createAuditoriaSchema, auditoriaQuerySchema } from '../dtos/auditoria.dto';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth);

// Exportar para Excel (deve vir antes de /:id)
router.get('/export/excel', validate({ query: auditoriaQuerySchema }), auditoriaController.exportarExcel);

// Exportar para CSV (deve vir antes de /:id)
router.get('/export/csv', validate({ query: auditoriaQuerySchema }), auditoriaController.exportarCSV);

// Buscar auditorias por entidade (deve vir antes de /:id)
router.get('/entidade/:entidade', auditoriaController.buscarPorEntidade);

// Listar auditorias com filtros
router.get('/', validate({ query: auditoriaQuerySchema }), auditoriaController.listar);

// Buscar auditoria por ID
router.get('/:id', auditoriaController.buscarPorId);

// Criar registro de auditoria (usado internamente)
router.post('/', validate({ body: createAuditoriaSchema }), auditoriaController.criar);

export default router;
