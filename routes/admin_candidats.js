const express = require('express');
const router = express.Router();
const connection = require('../db/database');

// Middleware pour vérifier si l'utilisateur est admin
function checkAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Accès refusé. Vous devez être admin.');
  }
  next();
}

// =====================
// PAGE ADMIN CANDIDATS
// =====================
router.get('/', checkAdmin, (req, res) => {
  const query = 'SELECT * FROM candidats ORDER BY id ASC';
  connection.query(query, (err, candidats) => {
    if (err) {
      console.error(err);
      return res.send('Erreur serveur');
    }
    res.render('admin_candidats', { user: req.session.user, candidats });
  });
});

// =====================
// AJOUTER UN CANDIDAT
// =====================
router.post('/ajouter', checkAdmin, (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.send('Le nom du candidat est requis.');

  connection.query('INSERT INTO candidats (nom) VALUES (?)', [nom], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Erreur serveur lors de l\'ajout.');
    }
    res.redirect('/admin/candidats');
  });
});

// =====================
// SUPPRIMER UN CANDIDAT
// =====================
router.post('/supprimer/:id', checkAdmin, (req, res) => {
  const candidatId = req.params.id;
  connection.query('DELETE FROM candidats WHERE id = ?', [candidatId], (err, result) => {
    if (err) {
      console.error(err);
      return res.send('Erreur serveur lors de la suppression.');
    }
    res.redirect('/admin/candidats');
  });
});

module.exports = router;
