import express from "express";
import passport from "passport";
import auth from "../models/auth.js";
import { checkSchema, validationResult } from "express-validator";
import { loginValidationSchema } from "../utils/loginSchema.js";

const loginController = express.Router();

loginController.post(
  "/login",
  auth.checkNotAuthenticated,
  checkSchema(loginValidationSchema, ["body"]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).send({ Error: errors.errors[0].msg });
    next();
  },
  passport.authenticate("local"),
  (_, res) => {
    res.sendStatus(200);
  },
);

loginController.get("/logout", auth.checkAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
});

loginController.all("*", (_, res) => {
  res.sendStatus(404);
});

export default loginController;
