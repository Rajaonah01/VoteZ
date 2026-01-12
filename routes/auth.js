const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db/database'); // ta connexion MySQL

// =====================
// PAGE INSCRIPTION
// =====================
router.get('/register', (req, res) => {
  // Si déjà connecté → vote
  if (req.session.user) return res.redirect('/vote');
  res.render('register', { error: null });
});

// =====================
// TRAITEMENT INSCRIPTION
// =====================
router.post('/register', async (req, res) => {
  const { nom, prenom, email, motdepasse } = req.body;

  if (!nom || !prenom || !email || !motdepasse) {
    return res.render('register', { error: 'Tous les champs sont obligatoires' });
  }

  // Vérifier si email existe déjà
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      return res.render('register', { error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motdepasse, 10);

    // Insérer utilisateur
    connection.query(
      'INSERT INTO users (nom, prenom, email, motdepasse) VALUES (?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword],
      (err, result) => {
        if (err) throw err;
        // Auto-login après inscription
        req.session.user = { id: result.insertId, nom, prenom, email };
        res.redirect('/vote');
      }
    );
  });
});

// =====================
// PAGE LOGIN
// =====================
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/vote');
  res.render('login', { error: null });
});

// =====================
// TRAITEMENT LOGIN
// =====================
router.post('/login', (req, res) => {
  const { email, motdepasse } = req.body;

  if (!email || !motdepasse) {
    return res.render('login', { error: 'Tous les champs sont obligatoires' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.render('login', { error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    const match = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!match) {
      return res.render('login', { error: 'Email ou mot de passe incorrect' });
    }

    // Login réussi
    req.session.user = { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role};
    res.redirect('/vote');
  });
});

// =====================
// LOGOUT
// =====================
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/vote');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
