import express, { Request, Response, Router } from 'express';
import 'dotenv/config';

import email from '../../infra/email';
import news from '../models/news';

const newsletterController: Router = express.Router();

//cadastrar email
newsletterController.post('/sign', (req, res) => {
  const userEmail = req.body.email;

  const signEmailResponse = news.signEmail(userEmail);

  email.send({
    from: { name: 'GPDA', address: 'naoresponda@gpda.com.br' },
    to: userEmail,
    subject: 'GPDA Newsletter',
    text: 'Agora você está pronto para acompanhar a newsletter oficial da GPDA! Agora é só aguardar a próxima publicação.',
  });
  res.status(200).json(signEmailResponse);
});

//deletar email

export default newsletterController;
