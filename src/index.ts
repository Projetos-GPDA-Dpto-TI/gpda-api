import { Server } from './server';

const server = new Server();
server.init();

console.log(`The env is: ${process.env.NODE_ENV}`);
