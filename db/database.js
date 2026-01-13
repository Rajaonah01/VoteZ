const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

connection.connect(err => {
  if (err) {
    console.error("❌ Erreur MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL (Aiven)");
  }
});

module.exports = connection;


// // const mysql = require('mysql2');

// // const connection = mysql.createConnection({
// //   host: 'localhost',
// //   user: 'root',
// //   password: '',  // ton mot de passe
// //   database: 'caissepro' // nom de la DB
// // });

// // connection.connect(err => {
// //   if (err) throw err;
// //   console.log('Connecté à la base de données MySQL');
// // });

// // module.exports = connection;
// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// connection.connect(err => {
//   if (err) {
//     console.error('❌ Erreur MySQL :', err);
//     return;
//   }
//   console.log('✅ Connecté à MySQL (Aiven)');
// });

// module.exports = connection;
