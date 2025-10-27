import { Request, Response } from "express";
import { contratoService } from "../services/contrato.service";
import { contratoSchema } from "../dtos/contrato.dto";

export const contratoController = {
  // POST
  async register(req: Request, res: Response) {
    try {
      console.log('📝 Dados recebidos:', JSON.stringify(req.body, null, 2));

      const validatedData = contratoSchema.parse(req.body);
      console.log('✅ Dados validados:', JSON.stringify(validatedData, null, 2));

      let existing = null;
      try {
        existing = await contratoService.findById(validatedData.id);
      } catch (err: any) {
        if (err.message !== "Contrato não encontrado") throw err;
      }

      if (existing) {
        return res.status(400).json({
          message: `Contrato com ID ${validatedData.id} já existe`,
        });
      }

      const created = await contratoService.create(validatedData);
      console.log('✅ Contrato criado:', created);

      return res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        console.error('❌ Erro de validação Zod:', error.errors);
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.errors,
        });
      }

      console.error('❌ Erro ao registrar contrato:', error);
      console.error('Stack:', error.stack);
      return res.status(500).json({
        message: "Erro ao registrar contrato",
        error: error.message
      });
    }
  },

  // UPDATE
  async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id;
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

  // GET ALL
  async list(req: Request, res: Response) {
    try {
      const contratos = await contratoService.findAll();
      return res.status(200).json(contratos);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao listar contratos" });
    }
  },

  // GET
  async getById(req: Request, res: Response) {
    const id: string = req.params.id;
    const found = await contratoService.findById(id);
    if (!found) return res.status(404).json({ error: 'Não encontrado' });
    res.json(found);
  },

  // DELETE
  async remove(req: Request, res: Response) {
    const id: string = req.params.id;
    await contratoService.remove(id);
    res.status(204).send();
  },
};
