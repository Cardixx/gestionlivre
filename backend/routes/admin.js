const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📋 Lister tous les admins
router.get('/', async(req, res) => {
    try {
        const [results] = await db.query('SELECT id_admin, username ,password FROM admin');
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ➕ Ajouter un admin
router.post('/', async(req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO admin (username, password) VALUES (?, ?)';

    try {
        const [result] = await db.query(sql, [username, password]);
        res.status(201).json({
            message: 'Admin ajouté',
            id: result.insertId
        });
    } catch (err) {
        console.error('Erreur ajout admin:', err);
        res.status(500).json({ error: 'Erreur ajout admin' });
    }
});

// ✏️ Modifier un admin
router.put('/:id', async(req, res) => {
    const { username, password } = req.body;
    const sql = 'UPDATE admin SET username=?, password=? WHERE id_admin=?';

    try {
        const [result] = await db.query(sql, [username, password, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.json({ message: 'Admin modifié' });
    } catch (err) {
        console.error('Erreur modification admin:', err);
        res.status(500).json({ error: 'Erreur modification admin' });
    }
});

// 🗑️ Supprimer un admin
router.delete('/:id', async(req, res) => {
    try {
        const [result] = await db.query('DELETE FROM admin WHERE id_admin=?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.json({ message: 'Admin supprimé' });
    } catch (err) {
        console.error('Erreur suppression admin:', err);

        // Cas où la suppression échoue à cause de contraintes (clé étrangère, etc.)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                error: 'Impossible de supprimer cet admin car il est référencé ailleurs'
            });
        }

        res.status(500).json({ error: 'Erreur suppression admin' });
    }
});

module.exports = router;