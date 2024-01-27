import express, { Request, Response, Router } from 'express';

const userController = express.Router();

userController.get('/status', (req: Request, res: Response): void => {
  res.status(200).json({ status: 'success', version: '1.0.0' });
});

export default userController;
