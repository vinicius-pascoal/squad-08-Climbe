import { Router } from 'express';
import { tarefaController } from '../controllers/tarefa.controller';
import { requireAuth } from '../middlewares/auth';

// Cria um novo roteador
export const tarefaRouter = Router();

// Aplica o middleware de autenticação em TODAS as rotas de tarefas abaixo.
tarefaRouter.use(requireAuth);


tarefaRouter.post('/', tarefaController.create);      
tarefaRouter.get('/', tarefaController.findAll);      
tarefaRouter.get('/:id', tarefaController.findById);  
tarefaRouter.put('/:id', tarefaController.update);    
tarefaRouter.delete('/:id', tarefaController.remove); 

