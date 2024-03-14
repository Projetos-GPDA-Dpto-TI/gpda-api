import request from 'supertest';
import 'dotenv/config';

test('GET to /api/v1/migrations should return 200', async () => {
  const signUrl = 'http://localhost:3000/api/newsletter/sign';

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody)).toBe(true);
});
