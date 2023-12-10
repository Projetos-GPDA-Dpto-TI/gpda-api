import { Server } from '@overnightjs/core';
import './util/module-alias';
import bodyParser from 'body-parser';
import { MessageController } from './controllers/mensageiro';
import { Application } from 'express';
import { DatabaseMemory } from './database-memory';
import { UserController } from './controllers/users';

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
    const usersController = new UserController

    super.addControllers([mensageiroController, usersController]);
  }

  // private setupDatabase(): void { //o ideal seria criar a database aqui e passar o objeto criado para o controller (pensar como fzr isso dps)
  //   const database = new DatabaseMemory()
  // }

  public getApp(): Application {
    return this.app;
  }
}
