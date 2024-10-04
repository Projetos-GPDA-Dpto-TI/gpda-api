import database from "../../infra/database.js";
import email from "../../infra/email.js";
import newsletter from "../models/newsletter.js";

async function publicateNews(
  title,
  description,
  content,
  authorId,
  status,
  imageUrl,
) {
  const databaseResponse = await database.query({
    text: "INSERT INTO news (title, description, content, author_id, status, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
    values: [title, description, content, authorId, status, imageUrl],
  });

  const parsedResponse = databaseResponse.rows[0];

  return parsedResponse;
}

async function deleteNew(newId) {
  const databaseResponse = await database.query({
    text: "DELETE FROM news WHERE id = $1 RETURNING *;",
    values: [newId],
  });

  const parsedResponse = databaseResponse.rows[0];

  return parsedResponse;
}

async function listNewsById(newId) {
  const databaseResponse = await database.query({
    text: "SELECT FROM news WHERE id = $1 AND status='published';",
    values: [newId],
  });

  const parsedResponse = databaseResponse.rows[0];

  return parsedResponse;
}

async function viewNews() {
  const databaseResponse = await database.query(
    "SELECT * FROM news WHERE status='published';",
  );

  const parsedResponse = databaseResponse.rows;

  return parsedResponse;
}

async function archiveNew(newId) {
  await database.query({
    text: "UPDATE news SET status='archived' WHERE id=$1;",
    values: [newId],
  });
}

async function undraftNew(newId) {
  await database.query({
    text: "UPDATE news SET status='public' WHERE id=$1;",
    values: [newId],
  });
}
//todo: how news will be shown on email??
async function notificateInNewsletter() {
  try {
    const { email_list: emailList } = await newsletter.getEmailList();
    for (const emailAddress of emailList) {
      await email.send({
        from: { name: "GPDA", address: "suporte@gpdaufabc.com.br" },
        to: emailAddress.email,
        subject: "Nova notícia publicada no site da GPDA",
        text: "Confira a notícia no link: https://www.gpdaufabc.tech/noticias",
      });
    }
  } catch (error) {
    console.error("Error sending on newsletter:", error);
  }
}

export default Object.freeze({
  publicateNews,
  deleteNew,
  archiveNew,
  viewNews,
  listNewsById,
  notificateInNewsletter,
  undraftNew,
});
