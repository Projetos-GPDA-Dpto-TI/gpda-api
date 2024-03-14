import express, { Router } from 'express';
import 'dotenv/config';

import news from '../models/news';

const newsController: Router = express.Router();

//todo: owner_id should be obtained automatically when the user submit a new
newsController.post('/publicate', async (req, res) => {
  const { title, description, body_text, owner_id, imageURL } = req.body;

  const uploadedNewReponse = await news.publicateNews(
    title,
    description,
    body_text,
    owner_id,
    imageURL
  );

  await news.publicateInNewsletter(
    title,
    description,
    body_text,
    owner_id,
    imageURL
  );

  res.send(200).json(uploadedNewReponse);
});

export default newsController;
