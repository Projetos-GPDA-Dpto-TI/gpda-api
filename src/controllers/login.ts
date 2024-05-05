import express, { Router } from 'express';
import auth from '../models/auth';

const loginController: Router = express.Router();

loginController.use(auth.userGetter);

loginController.get('/', (req, res) => {
  res.render('index.ejs');
});

loginController.get('/register', (req, res) => {
  res.render('register.ejs');
});

loginController.get('/login', (req, res) => {
  res.render('login.ejs');
});

loginController.get('/gpdamember', auth.loginRequired, (req: any, res) => {
  console.log('ID IS:', req.session.id);
  console.log('O user que entrou é o', req.user.name);
  res.render('dashboard.ejs', { name: req.user.name });
});

loginController.get('/admin', auth.adminRequired, (req, res) => {
  res.render('admin.ejs');
});

loginController.post('/login/password', async (req, res) => {
  const { email, password } = req.body;
  const match = await auth.authenticateUser(email, password);
  console.log('Auth got', match);
  try {
    if (match) {
      const userId = await auth.getuseridbyEmail(email);
      (req.session as any).userId = userId; //arumar essa inferencia de tipo remendada depois
      console.log('SESSION INFO:', req.session, req.session.id);
      res.redirect('/gpdamember');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

loginController.get('/login/password', (_, res) => {
  res.redirect('/login');
});

loginController.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error logging out' });
    } else {
      res.redirect('/');
    }
  });
});

loginController.all('*', (req, res) => {
  res.sendStatus(404);
});

export default loginController;
