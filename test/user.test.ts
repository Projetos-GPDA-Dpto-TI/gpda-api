import axios from 'axios';
import 'dotenv/config';
import query from '../infra/database';

const PORT: number = Number(process.env.EXPRESS_PORT);

test('GET to /user/status should return the following json fixture', async () => {
  const response = await axios.get(`http://localhost:${PORT}/api/user/status`);
  expect(response.status).toBe(200);
  expect(response.data).toEqual({ status: 'success', version: '1.0.0' });
});

test('db query 1+1 should return 2', async () => {
  const res = await query('SELECT 1 + 1;');
  expect(res.rows[0]['?column?']).toBe(2);
});

test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/status');
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.version).toEqual('16.1');
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
