function checkAuthenticated(req, res, next) {
  if (process.env.NODE_ENV === 'test' && req.query.test_name !== 'test-auth') return next()
  if (!req.user) return res.sendStatus(401);
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (process.env.NODE_ENV === 'test' && req.query.test_name !== 'test-auth' ) return next()
  if (req.user) return res.sendStatus(401);
  next();
}

function checkAdminAuthenticated(req, res, next) {
  if (process.env.NODE_ENV === 'test' && req.query.test_name !== 'test-auth') return next()
  if (!req.user || req.user.role !== "Admin") return res.sendStatus(401);
  next();
}

export default Object.freeze({
  checkAuthenticated,
  checkNotAuthenticated,
  checkAdminAuthenticated
});
