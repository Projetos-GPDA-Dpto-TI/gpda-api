import express from "express";

const webhookController = express.Router();

webhookController.get("/instagram", (req, res) => {
  if (process.env.WEBHOOK_IG_SECRET === req.query["hub.verify_token"]) {
    const challenge = req.query["hub.challenge"];
    if (!challenge) return res.sendStatus(401);
    res.status(200).json(parseInt(challenge));
  } else return res.sendStatus(401);
});

export default webhookController;
