import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';

import 'dotenv/config';
import 'dotenv-expand/config';

import useractionsController from './controllers/useractions';
import statusController from './controllers/status';
import newsletterController from './controllers/newsletter';
import migrationsController from './controllers/migrations';
import newsController from './controllers/news';
import loginController from './controllers/login';
import './models/auth-strategies/local';

export class Server {
  public readonly app: express.Application;
  public PORT: number;

  constructor() {
    this.app = express();
    this.app.set('views', path.join(__dirname, '/views'));
    this.app.set('view-engine', 'ejs');
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      session({
        secret: process.env.SESSION_PASSKEY,
        saveUninitialized: false,
        resave: false,
        cookie: {
          secure: process.env.NODE_ENV === 'development' ? false : true,
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 24 * 60 * 1000,
        },
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.setupControllers();
    this.PORT = Number(process.env.EXPRESS_PORT);
  }

  public async init() {
    this.app.listen(this.PORT);
    console.log(`Server listening on port ${this.PORT}`);
  }

  private setupControllers() {
    this.app.use('/api/user', useractionsController);
    this.app.use('/api', statusController);
    this.app.use('/api/newsletter', newsletterController);
    this.app.use('/api', migrationsController);
    this.app.use('/api/news', newsController);
    this.app.use('/', loginController);
  }
}
