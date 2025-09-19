const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📋 Lister tous les adhérents
router.get('/', async(req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM adherent');
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ➕ Ajouter un adhérent
router.post('/', async(req, res) => {
    const { nom, prenom, fonction, telephone } = req.body;
    const sql = 'INSERT INTO adherent (nom, prenom, fonction, telephone) VALUES (?, ?, ?, ?)';

    try {
        const [result] = await db.query(sql, [nom, prenom, fonction, telephone]);
        res.status(201).json({
            message: 'Adhérent ajouté',
            id: result.insertId
        });
    } catch (err) {
        console.error('Erreur ajout adhérent:', err);
        res.status(500).json({ error: 'Erreur ajout adhérent' });
    }
});

// ✏️ Modifier un adhérent
router.put('/:id', async(req, res) => {
    const { nom, prenom, fonction, telephone } = req.body;
    const sql = 'UPDATE adherent SET nom=?, prenom=?, fonction=?, telephone=? WHERE id_adherent=?';

    try {
        const [result] = await db.query(sql, [nom, prenom, fonction, telephone, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Adhérent non trouvé' });
        }

        res.json({ message: 'Adhérent modifié' });
    } catch (err) {
        console.error('Erreur modification adhérent:', err);
        res.status(500).json({ error: 'Erreur modification adhérent' });
    }
});

// 🗑️ Supprimer un adhérent
router.delete('/:id', async(req, res) => {
    try {
        const [result] = await db.query('DELETE FROM adherent WHERE id_adherent=?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Adhérent non trouvé' });
        }

        res.json({ message: 'Adhérent supprimé' });
    } catch (err) {
        console.error('Erreur suppression adhérent:', err);

        // Gestion spécifique des erreurs de contrainte de clé étrangère
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                error: 'Impossible de supprimer cet adhérent car il est référencé ailleurs'
            });
        }

        res.status(500).json({ error: 'Erreur suppression adhérent' });
    }
});

module.exports = router;