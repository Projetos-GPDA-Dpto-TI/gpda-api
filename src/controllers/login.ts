import express, { Router } from 'express';
import user from '../models/user';

const loginController: Router = express.Router();

loginController.get('/', (req, res) => {
  res.render('index.ejs');
});

loginController.get('/register', (req, res) => {
  res.render('register.ejs');
});

loginController.get('/login', (req, res) => {
  res.render('login.ejs');
});

loginController.get('/dashboard', (req, res) => {
  res.render('dashboard.ejs');
});

loginController.get('/admin', (req, res) => {
  res.render('admin.ejs');
});

export default loginController;
