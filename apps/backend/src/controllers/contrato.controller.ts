import { Request, Response } from "express";
import { contratoService } from "../services/contrato.service";
import { contratoSchema } from "../dtos/contrato.dto";

export const contratoController = {
  // POST
  async register(req: Request, res: Response) {
    try {
      const validatedData = contratoSchema.parse(req.body);
      const existing = await contratoService.findById(validatedData.id);
      if (existing) {
        return res.status(400).json({
          message: `Contrato com ID ${validatedData.id} já existe`,
        });
      }
    
      const created = await contratoService.create(validatedData);
      return res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Erro ao registrar contrato" });
    }
  },

  // UPDATE
  async update(req: Request, res: Response) {
    try {
      const id:string = req.params.id;
      const validatedData = contratoSchema.partial().parse(req.body);
      const existing = await contratoService.findById(id);
      if (!existing) {
        return res.status(400).json({
          message: `Contrato com ID ${validatedData.id} não existe`,
        });
      }
      
      const updated = await contratoService.update(id, validatedData);
      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar contrato" });
    }
  },

  // GET
  async getById(req: Request, res: Response) {
    const id:string = req.params.id;
    const found = await contratoService.findById(id);
    if (!found) return res.status(404).json({ error: 'Não encontrado' });
    res.json(found);
  },

  // DELETE
  async remove(req: Request, res: Response) {
    const id:string = req.params.id;
    await contratoService.remove(id);
    res.status(204).send();
  },
};