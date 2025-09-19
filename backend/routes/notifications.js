// routes/notifications.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { envoyerSMS } = require('../utils/sms');

router.post('/retard/:id', async(req, res) => {
    try {
        const id_pret = req.params.id;

        const query = `
      SELECT a.nom, a.telephone, l.titre, p.date_retour_prevue
      FROM pret p
      JOIN adherent a ON a.id_adherent = p.id_adherent
      JOIN livre l ON l.id_livre = p.id_livre
      WHERE p.id_pret = ? 
      AND p.date_retour_effective IS NULL 
      AND p.date_retour_prevue < CURDATE()
    `;

        const [results] = await db.promise().query(query, [id_pret]);

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Aucun prêt en retard trouvé',
                details: 'Vérifiez que le prêt existe et est bien en retard'
            });
        }

        const { nom, telephone, titre, date_retour_prevue } = results[0];
        const message = `Bonjour ${nom}, le livre "${titre}" devait être rendu le ${new Date(date_retour_prevue).toLocaleDateString('fr-FR')}. Merci de le retourner rapidement. - Bibliothèque TA`;

        await envoyerSMS(telephone, message);

        res.json({
            success: true,
            message: 'SMS envoyé avec succès',
            details: {
                destinataire: nom,
                telephone: telephone,
                livre: titre,
                date_retour: date_retour_prevue
            }
        });

    } catch (err) {
        console.error('Erreur notification retard:', err);
        res.status(500).json({
            error: 'Erreur lors de l\'envoi du SMS',
            details: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
});

module.exports = router;