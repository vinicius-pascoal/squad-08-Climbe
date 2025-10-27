import { Router } from 'express';
import { empresaController } from '../controllers/empresa.controller';
import { requireAuth } from '../middlewares/auth'; // Middleware para exigir login

export const empresaRouter = Router();

// Aplica autenticação a todas as rotas de empresas.
// Você pode adicionar mais middlewares aqui para verificar permissões específicas.
empresaRouter.use(requireAuth);

// Mapeia os métodos HTTP e URLs para as funções do controller.
empresaRouter.post('/', empresaController.create);      // Criar nova empresa
empresaRouter.get('/', empresaController.findAll);      // Listar todas as empresas
empresaRouter.get('/:id', empresaController.findById);  // Obter uma empresa por ID
empresaRouter.put('/:id', empresaController.update);    // Atualizar uma empresa por ID
empresaRouter.delete('/:id', empresaController.remove);