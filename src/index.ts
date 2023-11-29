import { SetupServer } from './server';

const server = new SetupServer();
server.init(3000);

//fazendo a requisição no routes.http, o controller envia a mensagem corretamente
