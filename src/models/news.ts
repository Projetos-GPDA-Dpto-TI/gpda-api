import database from '../../infra/database';

//todo: function to validate unique email
//todo: function to validate email form in client-side
//todo: function to validate data structure before query

async function signEmail(email: string): Promise<object> {
  const response = await database.query({
    text: 'INSERT INTO newsletter (email) VALUES $1 RETURNING email;',
    values: [email],
  });
  return { email: response };
}

export default Object.freeze({ signEmail });
