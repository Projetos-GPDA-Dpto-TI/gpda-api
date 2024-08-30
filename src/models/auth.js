async function checkAuthenticated(req, res, next) {
  if (!req.user) return res.sendStatus(401);
  next();
}

async function checkNotAuthenticated(req, res, next) {
  if (req.user) return res.sendStatus(401);
  next();
}

async function checkAdminAuthenticated(req, res, next) {
  if (!req.user || req.user.role !== "Admin") return res.sendStatus(401);
  next();
}

export default Object.freeze({
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdminAuthenticated,
});
