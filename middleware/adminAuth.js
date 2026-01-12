function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Vérifie si l'utilisateur est admin
function checkAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).send('Accès refusé. Vous devez être admin.');
  }
  next();
}

module.exports = { checkAuth, checkAdmin };

