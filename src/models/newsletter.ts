import database from '../../infra/database';
import email from '../../infra/email';
import crypto from 'crypto';

//todo: function to validate unique email
//todo: function to validate email form in client-side
//todo: function to validate data structure before query

async function signEmail(userEmail: string): Promise<object> {
  const id = crypto.randomUUID();
  const databaseResponse = await database.query({
    text: 'INSERT INTO newsletter (id, email) VALUES ($1, $2) RETURNING email;',
    values: [id, userEmail],
  });
  const parsedResponse = databaseResponse.rows[0].email;

  try {
    email.send({
      from: { name: 'GPDA', address: 'suporte@gpdaufabc.com.br' },
      to: userEmail,
      subject: 'GPDA Newsletter',
      text: 'Você está pronto para acompanhar a newsletter oficial da GPDA! Agora é só aguardar a próxima publicação.',
    });
  } catch (err) {
    console.error('Error sending email', err);
  }

  return { signed_email: parsedResponse };
}

async function deleteEmail(userEmail: string): Promise<object> {
  const databaseResponse = await database.query({
    text: 'DELETE FROM newsletter WHERE email=$1 RETURNING email;',
    values: [userEmail],
  });
  const parsedResponse = databaseResponse.rows[0];
  try {
    email.send({
      from: { name: 'GPDA', address: 'suporte@gpdaufabc.com.br' },
      to: userEmail,
      subject: 'GPDA Newsletter',
      text: 'Cancelamento da newsletter confirmado. Agora seu e-mail estará de fora dos nossos serviços.',
    });
  } catch (err) {
    console.error(err);
  }

  return { deleted_email: parsedResponse };
}

async function getEmailList(): Promise<any> {
  const databaseResponse = await database.query(
    'SELECT email FROM newsletter;'
  );

  const parsedResponse = databaseResponse.rows;
  return { email_list: parsedResponse };
}

async function getEmailUUID(userEmail: string): Promise<any> {
  const databaseResponse = await database.query({
    text: 'SELECT id FROM newsletter WHERE email=$1;',
    values: [userEmail],
  });

  const parsedResponse = databaseResponse.rows;
  return { email_UUID: parsedResponse };
}

async function getUserCount(): Promise<any> {
  const databaseReponse = await database.query(
    'SELECT count(1) as num FROM newsletter;'
  );

  const parsedResponse = parseInt(databaseReponse.rows[0]['num']);
  return { user_count: parsedResponse };
}

async function publicateInNewsletter(
  title: string,
  description: string,
  bodyText: string,
  ownerId: string,
  imageURL: string
) {
  try {
    const { email_list: emailList } = await getEmailList();
    for (const emailAddress of emailList) {
      await email.send({
        from: { name: 'GPDA', address: 'suporte@gpdaufabc.com.br' },
        to: emailAddress.email,
        subject: 'GPDA Newsletter: ' + title,
        text: `${title}\n\n${description}\n\n${bodyText}`,
      });
    }
  } catch (error) {
    console.error('Error sending newsletter:', error);
  }
}

export default Object.freeze({
  signEmail,
  deleteEmail,
  getEmailList,
  getUserCount,
  publicateInNewsletter,
  getEmailUUID,
});
