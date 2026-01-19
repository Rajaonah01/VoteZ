require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test
connection.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Erreur MySQL:', err.message);
  } else {
    console.log('✅ MySQL Clever Cloud connecté');
    conn.release();
  }
});

module.exports = connection;



// const mysql = require('mysql2');

// // ✅ POOL MySQL (stable pour Render + Clever Cloud)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'bheaahnugixnjv8zmvxo-mysql.services.clever-cloud.com',
//   user: process.env.DB_USER || 'udfstbiuf1t2cnlo',
//   password: process.env.DB_PASSWORD || 'QzQgHl8VQsx1LalNYOPK',
//   database: process.env.DB_NAME || 'bheaahnugixnjv8zmvxo',
//   port: process.env.DB_PORT || 3306,

//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // ✅ Test simple (sans fermer la connexion)
// pool.query('SELECT 1', (err) => {
//   if (err) {
//     console.error('❌ MySQL Clever Cloud non connecté:', err);
//   } else {
//     console.log('✅ Pool MySQL Clever Cloud connecté');
//   }
// });

// module.exports = pool;

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
