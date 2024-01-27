import axios from 'axios';
import 'dotenv/config';
import query from '../infra/database';

const PORT: number = Number(process.env.EXPRESS_PORT);

test('GET to /user/status should return the following json fixture', async () => {
  const response = await axios.get(`http://localhost:${PORT}/user/status`);
  console.log(response.data);
  expect(response.status).toBe(200);
  expect(response.data).toEqual({ status: 'success', version: '1.0.0' });
});

test('db query 1+1 should return 2', async () => {
  const res = await query('SELECT 1 + 1;');
  expect(res.rows[0]['?column?']).toBe(2);
});
