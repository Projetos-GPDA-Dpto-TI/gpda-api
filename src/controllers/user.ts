import express, { Request, Response, Router } from 'express';
import query from '../../infra/database';

const userController: Router = express.Router();

userController.get(
  '/status',
  async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', version: '1.0.0' });
  }
);

export default userController;
