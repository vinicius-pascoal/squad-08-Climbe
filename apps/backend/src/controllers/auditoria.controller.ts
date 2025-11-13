import { Request, Response, NextFunction } from 'express';
import { auditoriaService } from '../services/auditoria.service';
import { auditoriaQuerySchema } from '../dtos/auditoria.dto';

export const auditoriaController = {
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      const auditoria = await auditoriaService.registrar({
        ...req.body,
        ip,
        userAgent,
      });

      res.status(201).json(auditoria);
    } catch (error) {
      next(error);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = auditoriaQuerySchema.parse(req.query);
      const result = await auditoriaService.listar(parsed);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const auditoria = await auditoriaService.buscarPorId(id);
      res.json(auditoria);
    } catch (error) {
      next(error);
    }
  },

  async buscarPorEntidade(req: Request, res: Response, next: NextFunction) {
    try {
      const { entidade } = req.params;
      const entidadeId = req.query.entidadeId ? parseInt(req.query.entidadeId as string) : undefined;

      const auditorias = await auditoriaService.buscarPorEntidade(entidade, entidadeId);
      res.json(auditorias);
    } catch (error) {
      next(error);
    }
  },

  async exportarExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = auditoriaQuerySchema.parse(req.query);
      const workbook = await auditoriaService.exportarExcel(parsed);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=auditoria_${new Date().toISOString().split('T')[0]}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  },

  async exportarCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = auditoriaQuerySchema.parse(req.query);
      const csvContent = await auditoriaService.exportarCSV(parsed);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=auditoria_${new Date().toISOString().split('T')[0]}.csv`
      );

      // Add BOM for Excel to recognize UTF-8
      res.write('\uFEFF');
      res.write(csvContent);
      res.end();
    } catch (error) {
      next(error);
    }
  },
};
