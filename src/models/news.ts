import database from '../../infra/database';
import email from '../../infra/email';
import newsletter from '../models/newsletter';

async function publicateNews(
  title: string,
  description: string,
  body_text: string,
  owner_id: string,
  imageURL: string
): Promise<any> {
  const databaseResponse = await database.query({
    text: 'INSERT INTO news (title, description, body_text, owner_id, imageURL) VALUES $1, $2, $3, $4, $5 RETURNING title, description, body_text, owner_id, imageURL;',
    values: [title, description, body_text, owner_id, imageURL],
  });
  const parsedResponse = databaseResponse.rows[0];

  return { uploaded_new: parsedResponse };
}

async function deleteNews(new_id: string): Promise<object> {
  const databaseResponse = await database.query({
    text: 'DELETE FROM news WHERE id = $1 RETURNING title;',
    values: [new_id],
  });

  const parsedResponse = databaseResponse.rows[0];

  return { deleted_news: parsedResponse };
}

async function listNewsByOwner(owner_id: string) {
  const databaseResponse = await database.query({
    text: 'SELECT FROM news WHERE owner_id = $1;',
    values: [owner_id],
  });

  const parsedResponse = databaseResponse.rows[0];

  return { owner_id: owner_id, news_by_owner: parsedResponse };
}

//todo: how news will be shown on email??
async function publicateInNewsletter(
  title: string,
  description: string,
  body_text: string,
  owner_id: string,
  imageURL: string
) {
  const emailList = await newsletter.getEmailList();

  emailList.forEach((emailAddress: string) => {
    email.send({
      from: { name: 'GPDA', address: 'naoresponda@gpda.com.br' },
      to: emailAddress,
      subject: 'GPDA Newsletter',
      text: title,
    });
  });
}
export default Object.freeze({
  publicateNews,
  deleteNews,
  listNewsByOwner,
  publicateInNewsletter,
});
