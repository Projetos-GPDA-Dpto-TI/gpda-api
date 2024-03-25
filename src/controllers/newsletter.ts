import express, { Router } from 'express';
import 'dotenv/config';
import newsletter from '../models/newsletter';

const newsletterController: Router = express.Router();

//cadastrar email
newsletterController.post('/add', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json('Invalid request');
    }
    const signEmailResponse = await newsletter.signEmail(email);
    return res.status(200).json(signEmailResponse);
  } catch (err) {
    console.error('Error adding subscriber:', err);
    return res.sendStatus(500);
  }
});

//deleter email
newsletterController.delete('/remove', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json('Invalid request');
    }
    const deleteEmailResponse = await newsletter.deleteEmail(email);
    return res.status(200).json(deleteEmailResponse);
  } catch (err) {
    console.error('Error removing subscriber:', err);
    return res.sendStatus(500);
  }
});

newsletterController.get('/list', async (req, res) => {
  try {
    const emailList = await newsletter.getEmailList();
    return res.status(200).json(emailList);
  } catch (err) {
    console.error('Error getting newsletter email list:', err);
    return res.sendStatus(500);
  }
});

newsletterController.get('/count', async (req, res) => {
  try {
    const userCount = await newsletter.getUserCount();
    return res.status(200).json(userCount);
  } catch (err) {
    console.error('Error on userCount:', err);
    return res.sendStatus(500);
  }
});

export default newsletterController;
