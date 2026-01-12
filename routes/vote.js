const express = require('express');
const router = express.Router();
const connection = require('../db/database');

// Middleware pour vérifier si l'utilisateur est connecté
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// =====================
// PAGE VOTE (GET)
// =====================
router.get('/', checkAuth, (req, res) => {
  const userId = req.session.user.id;

  // Vérifier si l'utilisateur a déjà voté
  connection.query('SELECT * FROM votes WHERE user_id = ?', [userId], (err, voteResult) => {
    if (err) {
      console.error(err);
      return res.render('vote', {
        user: req.session.user,
        candidats: [],
        message: 'Erreur lors de la vérification du vote.'
      });
    }

    if (voteResult.length > 0) {
      // Déjà voté → message
      return res.render('vote', {
        user: req.session.user,
        candidats: [],
        message: 'Vous avez déjà voté !'
      });
    }

    // Récupérer tous les candidats
    connection.query('SELECT * FROM candidats ORDER BY nom ASC', (err, candidats) => {
      if (err) {
        console.error(err);
        return res.render('vote', {
          user: req.session.user,
          candidats: [],
          message: 'Erreur lors du chargement des candidats.'
        });
      }

      res.render('vote', {
        user: req.session.user,
        candidats,
        message: null
      });
    });
  });
});

// =====================
// TRAITEMENT VOTE (POST)
// =====================
router.post('/', checkAuth, (req, res) => {
  const userId = req.session.user.id;
  const candidatId = req.body.candidat_id;

  if (!candidatId) {
    return res.render('vote', {
      user: req.session.user,
      candidats: [],
      message: 'Veuillez sélectionner un candidat avant de voter.'
    });
  }

  // Vérifier si l'utilisateur a déjà voté
  connection.query('SELECT * FROM votes WHERE user_id = ?', [userId], (err, voteResult) => {
    if (err) {
      console.error(err);
      return res.render('vote', {
        user: req.session.user,
        candidats: [],
        message: 'Erreur lors de la vérification du vote.'
      });
    }

    if (voteResult.length > 0) {
      return res.render('vote', {
        user: req.session.user,
        candidats: [],
        message: 'Vous avez déjà voté !'
      });
    }

    // Enregistrer le vote
    connection.query(
      'INSERT INTO votes (user_id, candidat_id, date_vote) VALUES (?, ?, NOW())',
      [userId, candidatId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.render('vote', {
            user: req.session.user,
            candidats: [],
            message: 'Erreur lors de l’enregistrement de votre vote.'
          });
        }

        // Redirection vers la page résultats
        res.redirect('/resultats');
      }
    );
  });
});

module.exports = router;
