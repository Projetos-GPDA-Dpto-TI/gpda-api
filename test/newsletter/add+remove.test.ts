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

async function retrieveEmail() {
  try {
    const response = await database.query('SELECT * from newsletter;');
    return response.rows[0].email;
  } catch (err) {
    return undefined;
  }
}

const emailData = {
  email: 'usuario@example.com',
};

test('Add email to newsletter table', async () => {
  expect(await retrieveEmail()).toBeUndefined();
  const response = await fetch('http://localhost:3000/api/newsletter/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  expect(response.status).toBe(200);
  expect(await retrieveEmail()).toBe(emailData.email);
});

test('Remove email on newsletter table', async () => {
  expect(await retrieveEmail()).toBe(emailData.email);
  const response = await fetch('http://localhost:3000/api/newsletter/remove', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  expect(response.status).toBe(200);
  expect(await retrieveEmail()).toBeUndefined();
});
