// routes/pret.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 📋 Lister tous les prêts
router.get('/', async(req, res) => {
    try {
        const [results] = await db.query(`
            SELECT p.*, a.nom AS nom_adherent, a.prenom AS prenom_adherent, l.titre AS titre_livre
            FROM pret p
            JOIN adherent a ON p.id_adherent = a.id_adherent
            JOIN livre l ON p.id_livre = l.id_livre
        `);
        res.json(results);
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({ error: 'Erreur chargement prêts' });
    }
});

// 📄 Prêts en cours (non retournés)
router.get('/encours', async(req, res) => {
    try {
        const [results] = await db.query(`
            SELECT p.*, a.nom AS nom_adherent, a.prenom AS prenom_adherent, l.titre AS titre_livre
            FROM pret p
            JOIN adherent a ON p.id_adherent = a.id_adherent
            JOIN livre l ON p.id_livre = l.id_livre
            WHERE p.date_retour_effective IS NULL
        `);
        res.json(results);
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({ error: 'Erreur chargement prêts en cours' });
    }
});

// 📚 Livres disponibles (non prêtés ou déjà retournés)
router.get('/livres-disponibles', async(req, res) => {
    try {
        const [results] = await db.query(`
            SELECT l.* FROM livre l
            WHERE l.id_livre NOT IN (
                SELECT id_livre FROM pret WHERE date_retour_effective IS NULL
            )
        `);
        res.json(results);
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({ error: 'Erreur chargement livres disponibles' });
    }
});

// ➕ Ajouter un prêt
router.post('/', async(req, res) => {
    const { date_pret, date_retour_prevue, id_adherent, id_livre } = req.body;

    if (!date_pret || !date_retour_prevue || !id_adherent || !id_livre) {
        return res.status(400).json({ error: 'Champs manquants' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Ajouter le prêt
        await connection.query(
            `INSERT INTO pret (date_pret, date_retour_prevue, id_adherent, id_livre)
             VALUES (?, ?, ?, ?)`, [date_pret, date_retour_prevue, id_adherent, id_livre]
        );

        // 2. Mettre à jour le statut du livre
        await connection.query(
            `UPDATE livre SET en_pret = 1 WHERE id_livre = ?`, [id_livre]
        );

        await connection.commit();
        res.status(201).json({ message: 'Prêt enregistré et livre marqué comme prêté' });
    } catch (err) {
        await connection.rollback();
        console.error('Erreur DB:', err);
        res.status(500).json({ error: 'Erreur ajout prêt' });
    } finally {
        connection.release();
    }
});

// 🔁 Marquer comme retourné
router.put('/retour/:id', async(req, res) => {
    const { date_retour_effective } = req.body;
    const idPret = req.params.id;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Mettre à jour la date de retour
        const [updateResult] = await connection.query(
            `UPDATE pret SET date_retour_effective = ? WHERE id_pret = ?`, [date_retour_effective, idPret]
        );

        if (updateResult.affectedRows === 0) throw new Error('Prêt non trouvé');

        // 2. Récupérer l'ID du livre
        const [livreResult] = await connection.query(
            `SELECT id_livre FROM pret WHERE id_pret = ?`, [idPret]
        );

        if (livreResult.length === 0) throw new Error('Livre non trouvé');
        const id_livre = livreResult[0].id_livre;

        // 3. Mettre à jour le statut du livre
        await connection.query(
            `UPDATE livre SET en_pret = 0 WHERE id_livre = ?`, [id_livre]
        );

        await connection.commit();
        res.json({ message: 'Livre retourné et marqué comme disponible' });
    } catch (err) {
        await connection.rollback();
        console.error('Erreur DB:', err);
        res.status(500).json({ error: err.message || 'Erreur retour prêt' });
    } finally {
        connection.release();
    }
});

// ✏️ Modifier un prêt
router.put('/:id', async(req, res) => {
    const { date_pret, date_retour_prevue, date_retour_effective, id_adherent, id_livre } = req.body;

    if (!date_pret || !date_retour_prevue || !id_adherent || !id_livre) {
        return res.status(400).json({ error: 'Champs requis manquants' });
    }

    try {
        const [result] = await db.query(
            `UPDATE pret 
             SET date_pret = ?, date_retour_prevue = ?, date_retour_effective = ?, id_adherent = ?, id_livre = ?
             WHERE id_pret = ?`, [date_pret, date_retour_prevue, date_retour_effective, id_adherent, id_livre, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Prêt non trouvé' });
        }

        res.json({ message: 'Prêt modifié' });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({ error: 'Erreur modification prêt' });
    }
});

// 🗑 Supprimer un prêt
router.delete('/:id', async(req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM pret WHERE id_pret = ?', [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Prêt non trouvé' });
        }

        res.json({ message: 'Prêt supprimé' });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({ error: 'Erreur suppression prêt' });
    }
});

// 📌 Prêts en retard
router.get('/en-retard', async(req, res) => {
    try {
        const [results] = await db.query(`
            SELECT p.*, a.nom, a.prenom, l.titre
            FROM pret p
            JOIN adherent a ON p.id_adherent = a.id_adherent
            JOIN livre l ON p.id_livre = l.id_livre
            WHERE p.date_retour_effective IS NULL
            AND p.date_retour_prevue < CURDATE()
        `);
        res.json({ success: true, data: results });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ success: false, error: 'Erreur base de données' });
    }
});

// 📌 Nombre de retards
router.get('/retards/count', async(req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT COUNT(*) AS nb_retards
            FROM pret
            WHERE date_retour_effective IS NULL
            AND date_retour_prevue < CURDATE()
        `);
        res.json({ nb_retards: rows[0].nb_retards });
    } catch (err) {
        console.error("Erreur comptage retards:", err);
        res.status(500).json({ error: "Erreur récupération des retards" });
    }
});

module.exports = router;