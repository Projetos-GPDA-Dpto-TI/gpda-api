import { NextFunction, Request, Response } from 'express';

// prettier-ignore
async function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.sendStatus(401);
  next()
}

// prettier-ignore
async function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.user) return res.sendStatus(401);
  next();
}

// prettier-ignore
async function checkAdminAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'Admin') return res.sendStatus(401);
  next();
}

export default Object.freeze({
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdminAuthenticated,
});
