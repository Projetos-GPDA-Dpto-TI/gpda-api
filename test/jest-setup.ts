import { SetupServer } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  const server = new SetupServer();
  server.init(3000);
  global.testRequest = supertest(server.getApp());
});
