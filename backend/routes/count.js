// routes/count.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // connexion mysql2 callback

// 📊 Route pour compter les prêts en retard
router.get('/', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS nb_retards
        FROM pret
        WHERE date_retour_effective IS NULL
        AND date_retour_prevue < CURDATE()
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur comptage retards:', err);
            return res.status(500).json({ error: 'Erreur comptage retards' });
        }
        res.json({ count: results[0].nb_retards });
    });
});

module.exports = router;