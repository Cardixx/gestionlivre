// config/db.js
const mysql = require('mysql2/promise');

// ⚡ Création du pool en mode Promises
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestionlivre',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Test connexion
(async() => {
    try {
        const connection = await db.getConnection();
        console.log("✅ Connexion MySQL réussie (Promise)");
        connection.release();
    } catch (err) {
        console.error("❌ Erreur connexion MySQL:", err.message);
    }
})();

module.exports = db;