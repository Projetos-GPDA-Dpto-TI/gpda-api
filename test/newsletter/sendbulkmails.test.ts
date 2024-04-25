import database from '../../infra/services/database';
import 'dotenv/config';
import newsletter from '../../src/models/newsletter';

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

const emailServiceUrl = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

const emailData = {
  email: 'usuario@example.com',
};

const newsletterData = {
  title: 'TESTE',
  description: 'Isto é um teste',
  body_text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In rhoncus blandit lectus eu luctus. Praesent ac posuere tellus. Mauris sagittis vitae orci vel tincidunt. Etiam ut arcu ac risus molestie mattis. Etiam a tellus dolor. Mauris eget efficitur ex. Aliquam condimentum ac nulla non varius.',
  owner_id: '1',
  imageURL: '...',
};

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailServiceUrl}/messages`);
  const emailList = await emailListResponse.json();

  if (emailList.length === 0) {
    return null;
  }

  const lastEmailItem = emailList.pop();

  const emailTextResponse = await fetch(
    `${emailServiceUrl}/messages/${lastEmailItem.id}.plain`
  );
  const emailText = await emailTextResponse.text();
  lastEmailItem.text = emailText;

  return lastEmailItem;
}

async function deleteAllEmails() {
  await fetch(`${emailServiceUrl}/messages`, {
    method: 'DELETE',
  });
}

test('Send and check email (subscribe one user and send newsletter to user and check received email)', async () => {
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
  expect(response.status).toBe(200);

  await newsletter.publicateInNewsletter(
    newsletterData.title,
    newsletterData.description,
    newsletterData.body_text,
    newsletterData.owner_id,
    newsletterData.imageURL
  );

  const lastEmail = await getLastEmail();

  expect(lastEmail.sender).toBe('<suporte@gpdaufabc.com.br>');

  await deleteAllEmails();
});
