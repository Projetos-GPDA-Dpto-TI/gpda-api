import { DatabaseMemory } from './database-memory';
import { SetupServer } from './server';

const server = new SetupServer();
const database = new DatabaseMemory();

export function myDataBase() {
    return database
}

server.init(3000);



//fazendo a requisição no routes.http, o controller envia a mensagem corretamente
