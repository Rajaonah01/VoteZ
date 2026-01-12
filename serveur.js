const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// =====================
// Base de données
// =====================
const connection = require('./db/database');

// =====================
// Middleware
// =====================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// =====================
// Session
// =====================
app.use(session({
  secret: 'votezSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 heure
}));

// =====================
// Routes
// =====================
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const adminCandidatsRoutes = require('./routes/admin_candidats');

// =====================
// Utilisation routes
// =====================
app.use('/', authRoutes);                  // login / register
app.use('/vote', voteRoutes);             // vote utilisateur
app.use('/admin/candidats', adminCandidatsRoutes); // gestion candidats admin

// =====================
// ACCUEIL
// =====================
app.get('/', (req, res) => {
  res.render('accueil');
});

app.get('/marche', (req, res) => {
  res.render('marche');
});

// =====================
// RÉSULTATS
// =====================
app.get('/resultats', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const query = `
    SELECT c.nom, COUNT(v.id) AS total
    FROM candidats c
    LEFT JOIN votes v ON v.candidat_id = c.id
    GROUP BY c.id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Erreur serveur');
    }
    res.render('resultats', { results });
  });
});

// =====================
// LOGOUT
// =====================
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// =====================
// Serveur
// =====================
app.listen(port, () => {
  console.log(`🚀 VoteZ en ligne sur http://localhost:${port}`);
});
