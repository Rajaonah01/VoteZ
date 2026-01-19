const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');

// =====================
// Base de données (POOL)
// =====================
const db = require('./db/database');

// =====================
// App
// =====================
const app = express();
const port = process.env.PORT || 3000;

// 🔥 OBLIGATOIRE POUR RENDER
app.set('trust proxy', 1);

// =====================
// Middleware
// =====================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// =====================
// Session MySQL (STABLE)
// =====================
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 min
    expiration: 1000 * 60 * 60 // 1 heure
  },
  db
);

app.use(session({
  name: 'votez_session',
  secret: process.env.SESSION_SECRET || 'votezSecretKey',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Render gère le HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
}));

// =====================
// Routes
// =====================
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const adminCandidatsRoutes = require('./routes/admin_candidats');

app.use('/', authRoutes);
app.use('/vote', voteRoutes);
app.use('/admin/candidats', adminCandidatsRoutes);

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

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur résultats:', err);
      return res.status(500).send('Erreur serveur');
    }
    res.render('resultats', { results });
  });
});

// =====================
// LOGOUT
// =====================
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('votez_session');
    res.redirect('/');
  });
});

// =====================
// GESTION ERREURS GLOBALES
// =====================
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).send('Erreur interne');
});

// =====================
// Serveur
// =====================
app.listen(port, () => {
  console.log(`🚀 VoteZ lancé sur le port ${port}`);
});
