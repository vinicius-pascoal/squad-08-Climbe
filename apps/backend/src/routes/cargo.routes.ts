import { Router } from 'express';
import { prisma } from '../utils/prisma'; // seu PrismaClient centralizado

export const cargoRouter = Router();

cargoRouter.get('/', async (_req, res) => {
  const cargos = await prisma.cargo.findMany({
    select: { id: true, nomeCargo: true },
    orderBy: { nomeCargo: 'asc' }
  });
  res.json(cargos);
});
