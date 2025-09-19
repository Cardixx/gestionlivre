const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// 🔑 Clé secrète (mettre aussi dans .env)
const SECRET = process.env.JWT_SECRET || "bibliotheque_secret";

// 📌 Route Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Nom d’utilisateur et mot de passe requis" });
    }

    // Vérifier dans la table `admin`
    const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        const user = results[0];

        // ✅ On force le rôle = admin car c’est le président
        const role = "admin";

        // Génération du token JWT
        const token = jwt.sign({ id: user.id_admin, username: user.username, role },
            SECRET, { expiresIn: "2h" }
        );

        res.json({
            message: "Connexion réussie",
            token,
            role
        });
    });
});

module.exports = router;