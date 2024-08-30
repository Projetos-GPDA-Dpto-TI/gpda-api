import express from "express";
import newsletter from "../models/newsletter.js";

const newsletterController = express.Router();

//cadastrar email
newsletterController.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json("Invalid request");
    }
    const signEmailResponse = await newsletter.signEmail(email);
    return res.status(200).json(signEmailResponse);
  } catch (err) {
    console.error("Error adding subscriber:", err);
    return res.sendStatus(500);
  }
});

//deleter email
newsletterController.delete("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json("Invalid request");
    }
    const deleteEmailResponse = await newsletter.deleteEmail(email);
    return res.status(200).json(deleteEmailResponse);
  } catch (err) {
    console.error("Error removing subscriber:", err);
    return res.sendStatus(500);
  }
});

newsletterController.get("/list", async (_, res) => {
  try {
    const emailList = await newsletter.getEmailList();
    return res.status(200).json(emailList);
  } catch (err) {
    console.error("Error getting newsletter email list:", err);
    return res.sendStatus(500);
  }
});

newsletterController.get("/count", async (_, res) => {
  //will be used to display on site the number of subscribers
  try {
    const userCount = await newsletter.getUserCount();
    return res.status(200).json(userCount);
  } catch (err) {
    console.error("Error on userCount:", err);
    return res.sendStatus(500);
  }
});

newsletterController.post("/sendbulk", async (req, res) => {
  const { title, description, body_text, owner_id, imageURL } = req.body;

  try {
    await newsletter.publicateInNewsletter(
      title,
      description,
      body_text,
      owner_id,
      imageURL,
    );

    return res.status(200);
  } catch (err) {
    console.error("Error on sendbulk:", err);
    return res.sendStatus(500);
  }
});

export default newsletterController;
