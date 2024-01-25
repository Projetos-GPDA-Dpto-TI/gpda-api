import express from 'express';
import 'dotenv/config';
import userController from './controllers/user';

export class Server {
  private readonly app: express.Application;
  public PORT: number;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.setupControllers();
    this.dbConnect();
    this.PORT = Number(process.env.EXPRESS_PORT);
  }

  public init() {
    this.app.listen(this.PORT);
    console.log(`Server listening on port ${this.PORT}`);
  }

  private setupControllers() {
    this.app.use('/user', userController);
  }

  private dbConnect() {}
}
