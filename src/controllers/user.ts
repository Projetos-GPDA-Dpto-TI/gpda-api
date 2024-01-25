import express, { Request, Response, Router } from 'express';

const userController = express.Router();

userController.get('/status', (req: Request, res: Response): void => {
  res.json({ status: 'success', version: '1.0.0' });
  res.status(200);
});

export default userController;
