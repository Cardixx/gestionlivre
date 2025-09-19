const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * @swagger
 * /api/statistiques:
 *   get:
 *     summary: Récupère les statistiques de la bibliothèque
 *     tags: [Statistiques]
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLivres:
 *                       type: integer
 *                     livresDisponibles:
 *                       type: integer
 *                     livresEmpruntes:
 *                       type: integer
 *                     totalAdherents:
 *                       type: integer
 *                     pretsEnCours:
 *                       type: integer
 *                     pretsEnRetard:
 *                       type: integer
 *                     dernierLivre:
 *                       type: object
 *                     adherentActif:
 *                       type: object
 *                     livresEnRetard:
 *                       type: array
 *                     livresEmpruntesList:
 *                       type: array
 *                     lastUpdated:
 *                       type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/', async(req, res) => {
    try {
        // Exécution parallèle des requêtes
        const results = await Promise.all([
            getTotalLivres(),
            getLivresDisponibles(),
            getTotalAdherents(),
            getPretsEnCours(),
            getPretsEnRetard(),
            getDernierLivre(),
            getAdherentActif(),
            getLivresEnRetard(),
            getLivresEmpruntes()
        ]);

        // Extraction des résultats
        const [
            totalLivres,
            livresDisponibles,
            totalAdherents,
            pretsEnCours,
            pretsEnRetard,
            dernierLivre,
            adherentActif,
            livresEnRetard,
            livresEmpruntes
        ] = results;

        res.status(200).json({
            success: true,
            data: {
                totalLivres: totalLivres.total,
                livresDisponibles: livresDisponibles.disponibles,
                livresEmpruntes: totalLivres.total - livresDisponibles.disponibles,
                totalAdherents: totalAdherents.total,
                pretsEnCours: pretsEnCours.total,
                pretsEnRetard: pretsEnRetard.total,
                dernierLivre: dernierLivre[0] || null,
                adherentActif: adherentActif[0] || null,
                livresEnRetard,
                livresEmpruntesList: livresEmpruntes,
                lastUpdated: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Erreur statistiques:', error);

        res.status(500).json({
            success: false,
            error: 'Erreur serveur',
            details: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : null
        });
    }
});

// Fonctions de requête optimisées
async function getLivresDisponibles() {
    const [rows] = await db.query(`
        SELECT COUNT(*) AS disponibles 
        FROM livre 
        WHERE id_livre NOT IN (
            SELECT id_livre FROM pret WHERE date_retour_effective IS NULL
        )
    `);
    return rows[0];
}

async function getPretsEnCours() {
    const [rows] = await db.query(`
        SELECT COUNT(*) AS total 
        FROM pret 
        WHERE date_retour_effective IS NULL
    `);
    return rows[0];
}

async function getPretsEnRetard() {
    const [rows] = await db.query(`
        SELECT COUNT(*) AS total 
        FROM pret 
        WHERE date_retour_effective IS NULL
        AND date_retour_prevue < CURDATE()
    `);
    return rows[0];
}

async function getLivresEnRetard() {
    const [rows] = await db.query(`
        SELECT 
            p.id_pret,
            l.titre,
            l.auteur,
            a.nom AS nom_adherent,
            p.date_pret AS date_emprunt,
            p.date_retour_prevue,
            DATEDIFF(CURDATE(), p.date_retour_prevue) AS jours_retard
        FROM pret p
        JOIN livre l ON p.id_livre = l.id_livre
        JOIN adherent a ON p.id_adherent = a.id_adherent
        WHERE p.date_retour_effective IS NULL
        AND p.date_retour_prevue < CURDATE()
        ORDER BY jours_retard DESC
    `);
    return rows;
}

async function getLivresEmpruntes() {
    const [rows] = await db.query(`
        SELECT 
            p.id_pret,
            l.titre,
            l.auteur,
            a.nom AS nom_adherent,
            p.date_pret AS date_emprunt,
            p.date_retour_prevue
        FROM pret p
        JOIN livre l ON p.id_livre = l.id_livre
        JOIN adherent a ON p.id_adherent = a.id_adherent
        WHERE p.date_retour_effective IS NULL
        ORDER BY p.date_retour_prevue ASC
    `);
    return rows;
}

async function getTotalLivres() {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM livre`);
    return rows[0];
}

async function getTotalAdherents() {
    const [rows] = await db.query(`SELECT COUNT(*) AS total FROM adherent`);
    return rows[0];
}

async function getDernierLivre() {
    const [rows] = await db.query(`
        SELECT id_livre, titre, auteur 
        FROM livre 
        ORDER BY id_livre DESC 
        LIMIT 1
    `);
    return rows;
}

async function getAdherentActif() {
    const [rows] = await db.query(`
        SELECT a.id_adherent, a.nom, COUNT(p.id_pret) AS nb_prets
        FROM adherent a
        LEFT JOIN pret p ON a.id_adherent = p.id_adherent
        GROUP BY a.id_adherent
        ORDER BY nb_prets DESC
        LIMIT 1
    `);
    return rows;
}

module.exports = router;