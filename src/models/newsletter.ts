import database from '../../infra/database';
import email from '../../infra/email';

//todo: function to validate unique email
//todo: function to validate email form in client-side
//todo: function to validate data structure before query

async function signEmail(userEmail: string): Promise<object> {
  const databaseResponse = await database.query({
    text: 'INSERT INTO newsletter (email) VALUES $1 RETURNING email;',
    values: [userEmail],
  });
  const parsedResponse = databaseResponse.rows[0];

  email.send({
    from: { name: 'GPDA', address: 'naoresponda@gpda.com.br' },
    to: userEmail,
    subject: 'GPDA Newsletter',
    text: 'Você está pronto para acompanhar a newsletter oficial da GPDA! Agora é só aguardar a próxima publicação.',
  });

  return { signed_email: parsedResponse };
}

async function deleteEmail(userEmail: string): Promise<object> {
  const databaseResponse = await database.query({
    text: 'DELETE FROM newsletter WHERE email=$1 RETURNIN email;',
    values: [userEmail],
  });
  const parsedResponse = databaseResponse.rows[0];

  email.send({
    from: { name: 'GPDA', address: 'naoresponda@gpda.com.br' },
    to: userEmail,
    subject: 'GPDA Newsletter',
    text: 'Cancelamento da newsletter confirmado. Agora seu e-mail estará de fora dos nossos serviços.',
  });

  return { deleted_email: parsedResponse };
}

async function getEmailList(): Promise<any> {
  const databaseResponse = await database.query(
    'SELECT email FROM newsletter;'
  );

  const parsedResponse = databaseResponse.rows;
  return { emailList: parsedResponse };
}

export default Object.freeze({ signEmail, deleteEmail, getEmailList });
