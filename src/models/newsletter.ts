import database from '../../infra/services/database';
import email from '../../infra/services/email';

//todo: function to validate unique email
//todo: function to validate email form in client-side
//todo: function to validate data structure before query

async function signEmail(userEmail: string): Promise<object> {
  const databaseResponse = await database.query({
    text: 'INSERT INTO newsletter (email) VALUES ($1) RETURNING email;',
    values: [userEmail],
  });
  const parsedResponse = databaseResponse.rows[0].email;

  try {
    email.send({
      from: { name: 'GPDA', address: 'naoresponda@gpda.com.br' },
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
      from: { name: 'GPDA', address: 'naoresponda@gpda.com.br' },
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

async function getUserCount(): Promise<any> {
  const databaseReponse = await database.query(
    'SELECT count(1) as num FROM newsletter;'
  );

  const parsedResponse = parseInt(databaseReponse.rows[0]['num']);
  return { user_count: parsedResponse };
}

export default Object.freeze({
  signEmail,
  deleteEmail,
  getEmailList,
  getUserCount,
});
