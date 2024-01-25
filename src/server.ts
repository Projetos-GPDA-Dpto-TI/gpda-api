import express from 'express';
import 'dotenv/config';
import userController from './controllers/user';
import dbConnect from '../infra/database';
import { QueryResult } from 'pg';

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
    const res: QueryResult = await dbConnect('SELECT 1 + 1;');
    console.log(res);
    this.app.listen(this.PORT);
    console.log(`Server listening on port ${this.PORT}`);
  }

  private setupControllers() {
    this.app.use('/user', userController);
  }
}
