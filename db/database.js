const mysql = require('mysql2');

// Connexion à Clever Cloud MySQL
const connection = mysql.createConnection({
  host: 'bheaahnugixnjv8zmvxo-mysql.services.clever-cloud.com',
  user: 'udfstbiuf1t2cnlo',
  password: 'QzQgHl8VQsx1LalNYOPK',
  database: 'bheaahnugixnjv8zmvxo',
  port: 3306
});

// Test de connexion
connection.connect(err => {
  if (err) {
    console.error('Erreur de connexion MySQL Clever Cloud:', err);
    return;
  }
  console.log('✅ Connecté à MySQL Clever Cloud !');
});

module.exports = connection;

// PORT CONNECTER SUR CLEVER CLOUD
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST || 'ton_host_clever',     // Host fourni par Clever Cloud
//   user: process.env.DB_USER || 'ton_user',           // User Clever Cloud
//   password: process.env.DB_PASSWORD || 'ton_mdp',    // Mot de passe
//   database: process.env.DB_NAME || 'nom_base',       // Nom de la base
//   port: process.env.DB_PORT || 3306                  // Port
// });

// // Test
// connection.connect(err => {
//   if (err) console.error('Erreur connexion MySQL Clever Cloud:', err);
//   else console.log('Connecté à MySQL Clever Cloud !');
// });

// module.exports = connection;

// PORT MANDEHA SUR INFINITY AVEC BLOCAGE
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306
// });

// connection.connect(err => {
//   if (err) console.error('Erreur de connexion MySQL:', err);
//   else console.log('Connecté à MySQL InfinityFree !');
// });

// module.exports = connection;



// // db.js MYSQL 2 MANDEHA LOCAL
// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'caissepro'
// });

// connection.connect(err => {
//   if (err) throw err;
//   console.log('Connecté à MySQL');
// });

// module.exports = connection;
