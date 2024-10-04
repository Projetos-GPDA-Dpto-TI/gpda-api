import express from "express";

import news from "../models/news.js";
import auth from "../models/auth.js";

const newsController = express.Router();

newsController.post("/publicate", auth.checkAuthenticated, async (req, res) => {
  const status = "published";
  const { title, description, content, imageUrl } = req.body;
  let authorId;
  if (process.env.NODE_ENV === "test") {
    authorId = 123456;
  } else {
    authorId = req.user.id;
  }
  const uploadedNewReponse = await news.publicateNews(
    title,
    description,
    content,
    authorId,
    status,
    imageUrl,
  );

  await news.notificateInNewsletter();
  //usado para notificar que uma noticia nova foi cadastrada no site gpda;

  res.status(201).json({
    message: "User created",
    publicated_new: uploadedNewReponse,
  });
});

newsController.post("/draft", auth.checkAuthenticated, async (req, res) => {
  const status = "draft";
  const { title, description, content, imageUrl } = req.body;
  const authorId = req.user.id;

  const uploadedNewReponse = await news.publicateNews(
    title,
    description,
    content,
    authorId,
    status,
    imageUrl,
  );

  res.sendStatus(200).json(uploadedNewReponse);
});

newsController.patch(
  "/undraft/:id",
  auth.checkAuthenticated,
  async (req, res) => {
    const newId = req.params.id;
    await news.undraftNew(newId);

    res.sendStatus(200);
  },
);

newsController.patch(
  "/archive/:id",
  auth.checkAuthenticated,
  async (req, res) => {
    const newId = req.params.id;
    await news.archiveNew(newId);

    res.sendStatus(200);
  },
);

newsController.delete(
  "/delete/:id",
  auth.checkAdminAuthenticated,
  async (req, res) => {
    const newId = req.params.id;
    const newResponse = await news.deleteNew(newId);

    res.status(200).json({
      deleted_new: newResponse,
    });
  },
);

newsController.get("/view", async (req, res) => {
  if (req.query.id) {
    const newId = decodeURIComponent(req.query.id);
    const newContent = await news.listNewsById(newId);
    res.status(200).json(newContent);
  } else {
    const response = await news.viewNews();
    res.status(200).json(response);
  }
});

export default newsController;
