import express from 'express';
import 'dotenv/config';
import userController from './controllers/user';
import statusController from './controllers/status';

export class Server {
  private readonly app: express.Application;
  public PORT: number;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.setupControllers();
    this.PORT = Number(process.env.EXPRESS_PORT);
  }

  public async init() {
    this.app.listen(this.PORT);
    console.log(`Server listening on port ${this.PORT}`);
  }

  private setupControllers() {
    this.app.use('/api/user', userController);
    this.app.use('/api', statusController);
  }
}
