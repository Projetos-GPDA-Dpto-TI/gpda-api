import express from 'express';

import 'dotenv/config';
import 'dotenv-expand/config';

import useractionsController from '../controllers/useractions';
import statusController from '../controllers/status';
import newsletterController from '../controllers/newsletter';
import migrationsController from '../controllers/migrations';
import newsController from '../controllers/news';

export class Server {
  public readonly app: express.Application;
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
    this.app.use('/api/user', useractionsController);
    this.app.use('/api', statusController);
    this.app.use('/api/newsletter', newsletterController);
    this.app.use('/api', migrationsController);
    this.app.use('/api/news', newsController);
  }
}
