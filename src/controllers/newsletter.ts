import express, { Router } from 'express';
import 'dotenv/config';
import newsletter from '../models/newsletter';

const newsletterController: Router = express.Router();

//cadastrar email
newsletterController.post('/sign', async (req, res) => {
  const userEmail = req.body.email;
  try {
    const signEmailResponse = await newsletter.signEmail(userEmail);
    res.status(200).json(signEmailResponse);
  } catch (error) {
    res.sendStatus(500);
  }
});

//deleter email
newsletterController.delete('/delete', async (req, res) => {
  const userEmail = req.body.email;
  try {
    const deleteEmailResponse = await newsletter.deleteEmail(userEmail);
    res.status(200).json(deleteEmailResponse);
  } catch (error) {
    res.sendStatus(500);
  }
});

newsletterController.get('/list', async (req, res) => {
  try {
    const emailList = await newsletter.getEmailList();
    res.status(200).json(emailList);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default newsletterController;
