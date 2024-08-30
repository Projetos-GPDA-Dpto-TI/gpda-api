import database from "../../infra/database.js";
import email from "../../infra/email.js";
import newsletter from "../models/newsletter.js";

async function publicateNews(
  title,
  description,
  body_text,
  owner_id,
  imageURL,
) {
  const databaseResponse = await database.query({
    text: "INSERT INTO news (title, description, body_text, owner_id, imageURL) VALUES $1, $2, $3, $4, $5 RETURNING title, description, body_text, owner_id, imageURL;",
    values: [title, description, body_text, owner_id, imageURL],
  });
  const parsedResponse = databaseResponse.rows[0];

  return { uploaded_new: parsedResponse };
}

async function deleteNews(new_id) {
  const databaseResponse = await database.query({
    text: "DELETE FROM news WHERE id = $1 RETURNING title;",
    values: [new_id],
  });

  const parsedResponse = databaseResponse.rows[0];

  return { deleted_news: parsedResponse };
}

async function listNewsByOwner(owner_id) {
  const databaseResponse = await database.query({
    text: "SELECT FROM news WHERE owner_id = $1;",
    values: [owner_id],
  });

  const parsedResponse = databaseResponse.rows[0];

  return { owner_id: owner_id, news_by_owner: parsedResponse };
}

//todo: how news will be shown on email??
async function notificateInNewsletter(
  title,
  description,
  bodyText,
  //ownerId,
  //imageURL,
) {
  try {
    const { email_list: emailList } = await newsletter.getEmailList();
    for (const emailAddress of emailList) {
      await email.send({
        from: { name: "GPDA", address: "suporte@gpdaufabc.com.br" },
        to: emailAddress.email,
        subject: "GPDA Newsletter: " + title,
        text: `${title}\n\n${description}\n\n${bodyText}`,
      });
    }
  } catch (error) {
    console.error("Error sending newsletter:", error);
  }
}

export default Object.freeze({
  publicateNews,
  deleteNews,
  listNewsByOwner,
  notificateInNewsletter,
});
