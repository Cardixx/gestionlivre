const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @swagger
 * tags:
 *   name: Livres
 *   description: Gestion des livres de la bibliothèque
 */

// Middleware de validation
const validateBookData = (req, res, next) => {
    const { titre, auteur, categorie, annee_edition } = req.body;
    const currentYear = new Date().getFullYear();

    if (!titre || !auteur || !categorie || !annee_edition) {
        return res.status(400).json({
            success: false,
            error: 'Titre, auteur, catégorie et année d\'édition sont requis'
        });
    }

    if (isNaN(annee_edition) || annee_edition < 1900 || annee_edition > currentYear) {
        return res.status(400).json({
            success: false,
            error: `L'année d'édition doit être comprise entre 1900 et ${currentYear}`
        });
    }

    next();
};

// GET /api/livres - Afficher tous les livres
router.get('/', async(req, res) => {
    try {
        const [livres] = await db.query('SELECT * FROM livre ORDER BY id_livre DESC');
        res.json({
            success: true,
            data: livres
        });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({
            success: false,
            error: 'Erreur de base de données'
        });
    }
});

// POST /api/livres - Ajouter un livre
router.post('/', validateBookData, async(req, res) => {
    const { titre, auteur, categorie, annee_edition, en_pret = 0 } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO livre (titre, auteur, categorie, annee_edition, en_pret) VALUES (?, ?, ?, ?, ?)', [titre, auteur, categorie, annee_edition, en_pret]
        );

        res.status(201).json({
            success: true,
            data: {
                id_livre: result.insertId,
                titre,
                auteur,
                categorie,
                annee_edition,
                en_pret
            }
        });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'ajout du livre'
        });
    }
});

// PUT /api/livres/:id - Modifier un livre
router.put('/:id', validateBookData, async(req, res) => {
    const id = parseInt(req.params.id);
    const { titre, auteur, categorie, annee_edition, en_pret } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID invalide'
        });
    }

    try {
        const [result] = await db.query(
            'UPDATE livre SET titre = ?, auteur = ?, categorie = ?, annee_edition = ?, en_pret = ? WHERE id_livre = ?', [titre, auteur, categorie, annee_edition, en_pret, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Livre non trouvé'
            });
        }

        res.json({
            success: true,
            data: {
                id_livre: id,
                titre,
                auteur,
                categorie,
                annee_edition,
                en_pret
            }
        });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la modification du livre'
        });
    }
});

// DELETE /api/livres/:id - Supprimer un livre
router.delete('/:id', async(req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID invalide'
        });
    }

    try {
        const [result] = await db.query('DELETE FROM livre WHERE id_livre = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Livre non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Livre supprimé'
        });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du livre'
        });
    }
});

module.exports = router;