import express, { Router } from 'express';
import 'dotenv/config';
import newsletter from '../models/newsletter';

const newsletterController: Router = express.Router();

//cadastrar email
newsletterController.post('/sign', (req, res) => {
  const userEmail = req.body.email;

  const signEmailResponse = newsletter.signEmail(userEmail);

  res.status(200).json(signEmailResponse);
});

//deleter email
newsletterController.delete('/delete', (req, res) => {
  const userEmail = req.body.email;

  const deleteEmailResponse = newsletter.deleteEmail(userEmail);

  res.status(200).json(deleteEmailResponse);
});

export default newsletterController;
