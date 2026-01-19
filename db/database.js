const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect(err => {
  if (err) console.error('Erreur de connexion MySQL:', err);
  else console.log('Connecté à MySQL InfinityFree !');
});

module.exports = connection;



// // db.js
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
