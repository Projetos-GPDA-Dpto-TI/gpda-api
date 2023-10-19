import { Request, Response } from 'express';
import assert from 'assert';
import request from 'supertest';
const app = require('express')();

app.get('/api/breeds/image/random', function (req: Request, res: Response) {
  res.status(200).json({
    message: 'https://example.com/',
    status: 'success',
  });
});

describe('Teste funcional basico', () => {
  it('verifica o funcionamento de uma API generica criada acima', async () => {
    request(app)
      .get('/api/breeds/image/random')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(function (res) {
        assert(res.body.hasOwnProperty('status'));
        assert(res.body.hasOwnProperty('message'));
      })
      .end(function (err, res) {
        if (err) throw err;
        console.log(res.body);
      });
  });
});
