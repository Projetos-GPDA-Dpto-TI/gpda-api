import express from "express";

import news from "../models/news.js";

const newsController = express.Router();

//todo: owner_id should be obtained automatically when the user submit a new
newsController.post("/publicate", async (req, res) => {
  const { title, description, body_text, owner_id, imageURL } = req.body;

  const uploadedNewReponse = await news.publicateNews(
    title,
    description,
    body_text,
    owner_id,
    imageURL,
  );

  await news.notificateInNewsletter(
    //usado para notificar que uma noticia nova foi cadastrada no site gpda
    title,
    description,
    body_text,
    owner_id,
    imageURL,
  );

  res.send(200).json(uploadedNewReponse);
});

export default newsController;
