import express, { Router } from 'express';
import passport from 'passport';
import auth from '../models/auth';

const loginController: Router = express.Router();

loginController.get('/', (req, res) => {
  res.render('index.ejs');
});

loginController.get('/login', auth.checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

// prettier-ignore
loginController.post('/login/auth', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}))

loginController.get('/logout', auth.checkAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
});

loginController.get('/register', auth.checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

loginController.get('/admin', auth.checkAdminAuthenticated, (req, res) => {
  res.render('admin.ejs', { name: req.user.name });
});

loginController.get('/dashboard', auth.checkAuthenticated, (req, res) => {
  res.render('dashboard.ejs', { name: req.user.name });
});

loginController.all('*', (req, res) => {
  res.sendStatus(404);
});

export default loginController;
