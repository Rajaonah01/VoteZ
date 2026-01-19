const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');

// =====================
// Base de données
// =====================
const connection = require('./db/database'); // connexion Clever Cloud

// =====================
// App
// =====================
const app = express();
const port = process.env.PORT || 3000;

// =====================
// Middleware
// =====================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// =====================
// Session MySQL
// =====================
const sessionStore = new MySQLStore({}, connection.promise());

app.use(session({
  key: 'votez_session',
  secret: 'votezSecretKey',
  store: sessionStore,
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

app.use('/', authRoutes);                     // login / register
app.use('/vote', voteRoutes);                // vote utilisateur
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
    res.clearCookie('votez_session');
    res.redirect('/');
  });
});

// =====================
// Serveur
// =====================
app.listen(port, () => {
  console.log(`🚀 VoteZ en ligne sur http://localhost:${port}`);
});
