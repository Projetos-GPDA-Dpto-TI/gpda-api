import express, { Request, Response, Router } from 'express';
import health from '../models/health';
import 'dotenv/config';

const statusController: Router = express.Router();

statusController.get(
  '/status',
  async (req: Request, res: Response): Promise<void> => {
    const updatedAt = new Date().toISOString();
    const dbHealthInfo = await health.dbHealth();
    res.status(200).json({
      updated_at: updatedAt,
      database: dbHealthInfo,
    });
  }
);

export default statusController;
