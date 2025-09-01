import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async token(req: Request, res: Response) {
    const { username, password } = req.body;
    const result = await authService.passwordGrant(username, password);
    res.json(result);
  },
};
