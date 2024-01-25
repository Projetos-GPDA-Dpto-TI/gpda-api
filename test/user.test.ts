import axios from 'axios';
import 'dotenv/config';

const PORT: number = Number(process.env.EXPRESS_PORT);

test('GET to /user/status should return the following json fixture', async () => {
  const response = await axios.get(`http://localhost:${PORT}/user/status`);
  console.log(response.data);
  expect(response.status).toBe(200);
  expect(response.data).toEqual({ status: 'success', version: '1.0.0' });
});
