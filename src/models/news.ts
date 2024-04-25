import database from '../../infra/services/database';
import email from '../../infra/services/email';
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
async function notificateInNewsletter(
  title: string,
  description: string,
  bodyText: string,
  ownerId: string,
  imageURL: string
) {
  try {
    const { email_list: emailList } = await newsletter.getEmailList();
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
  publicateNews,
  deleteNews,
  listNewsByOwner,
  notificateInNewsletter,
});
