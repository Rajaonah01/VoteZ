function checkAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function checkAdmin(req, res, next) {
  if (!req.session || !req.session.user || req.session.user.isAdmin !== 1) {
    return res.status(403).render('403'); // ou res.send(...)
  }
  next();
}

module.exports = { checkAuth, checkAdmin };
