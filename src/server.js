import express from "express";
import session from "express-session";
import passport from "passport";

import "dotenv/config";
import "dotenv-expand/config";

import "./models/auth-strategies/local.js";

import useractionsController from "./controllers/useractions.js";
import statusController from "./controllers/status.js";
import newsletterController from "./controllers/newsletter.js";
import migrationsController from "./controllers/migrations.js";
import newsController from "./controllers/news.js";
import loginController from "./controllers/login.js";

export class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      session({
        secret: process.env.SESSION_PASSKEY,
        saveUninitialized: false,
        resave: false,
        cookie: {
          secure: process.env.NODE_ENV === "development" ? false : false,
          httpOnly: true,
          sameSite: "lax",
          maxAge: 24 * 60 * 1000,
        },
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.setupControllers();
    this.PORT = Number(process.env.EXPRESS_PORT);
  }

  async init() {
    this.app.listen(this.PORT);
    console.log(`Server listening on port ${this.PORT}`);
  }

  setupControllers() {
    this.app.use("/api/user", useractionsController);
    this.app.use("/api", statusController);
    this.app.use("/api/newsletter", newsletterController);
    this.app.use("/api", migrationsController);
    this.app.use("/api/news", newsController);
    this.app.use("/api/user", loginController);
  }
}
