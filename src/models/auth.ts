import { NextFunction, Request, Response } from 'express';
import db from '../../infra/database';
import bcrypt from 'bcrypt';
import user from '../models/user';

async function getuseridbyEmail(email: string) {
  const response = await db.query({
    text: 'SELECT id FROM member WHERE email=$1;',
    values: [email],
  });
  return response.rows[0].id;
}

async function getuserbyEmail(email: string) {
  const response = await db.query({
    text: 'SELECT id, name, username, email, role, password_hash FROM member WHERE email=$1;',
    values: [email],
  });
  return response.rows[0];
}

// prettier-ignore
async function authenticateUser(email: string, password: string): Promise<boolean> {
  if (!email || !password) return false;
  try {
    const user = await getuserbyEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// prettier-ignore
async function userGetter(req: any, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    req.user = await user.listById(req.session.userId as any); //arumar isso aqui tambem depois
    return next();
  }
  return next();
}

// prettier-ignore
async function loginRequired(req: any, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    console.log('Autenticado')
    return next()
  }
  return res.redirect('/')
}

async function adminRequired(req: any, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    const member = await user.listById(req.session.userId);
    console.log(member.role);
    if (member.role === 'Admin') {
      console.log('Autenticado');
      return next();
    }
  }
  console.log('Nao autenticado');
  return res.redirect('/');
}

export default Object.freeze({
  authenticateUser,
  getuseridbyEmail,
  userGetter,
  loginRequired,
  adminRequired,
});
