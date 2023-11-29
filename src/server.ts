import { Server } from '@overnightjs/core';
import './util/module-alias';
import bodyParser from 'body-parser';
import { MessageController } from './controllers/mensageiro';
import { Application } from 'express';

export class SetupServer extends Server {
  constructor() {
    super();
  }

  public init(port: number): void {
    this.setupExpress();
    this.setupControllers();
    this.app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const mensageiroController = new MessageController();
    super.addControllers([mensageiroController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
