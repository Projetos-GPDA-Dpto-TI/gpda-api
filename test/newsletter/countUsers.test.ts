import database from '../../infra/services/database';
import 'dotenv/config';

beforeAll(cleanDatabase);
beforeAll(runMigrations);

async function cleanDatabase() {
  await database.query('DROP schema public cascade; CREATE schema public;');
}

async function runMigrations() {
  await fetch('http://localhost:3000/api/migrations', {
    method: 'POST',
  });
}

import newsletter from '../../src/models/newsletter';

const emailData = {
  email: 'usuario@example.com',
};

async function addEmail(emailData: object) {
  const response = await fetch(
    'http://localhost:3000/api/newsletter/subscribe',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    }
  );
  return response;
}

async function addMultipleEmails(emailData: object, iterations: number) {
  const emailDataArray = Array(iterations).fill(emailData);

  await Promise.all(emailDataArray.map(addEmail));
}

test('User count on newsletter table', async () => {
  const { user_count: userCount } = await newsletter.getUserCount();
  expect(userCount).toBe(0);

  const response = await addEmail(emailData);
  expect(response.status).toBe(200);

  const { user_count: userCount2 } = await newsletter.getUserCount();
  expect(userCount2).toBe(1);

  const num = 3;
  await addMultipleEmails(emailData, num);

  const { user_count: userCount3 } = await newsletter.getUserCount();
  expect(userCount3).toBe(num + 1);
});
