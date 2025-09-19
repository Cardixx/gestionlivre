// utils/scheduler.js
const cron = require('node-cron');
const db = require('../config/db');
const { envoyerSMS } = require('./sms');

function demarrerScheduler() {
    // Tous les jours à 9h00 du matin
    cron.schedule('0 9 * * *', async() => {
        console.log('🔔 Vérification quotidienne des ouvrages en retard...');

        const query = `
            SELECT a.nom, a.telephone, l.titre, p.date_retour_prevue
            FROM pret p
            JOIN adherent a ON p.id_adherent = a.id_adherent
            JOIN livre l ON p.id_livre = l.id_livre
            WHERE p.date_retour_effective IS NULL
              AND p.date_retour_prevue < CURDATE()
        `;

        try {
            // En mysql2, on récupère [rows] avec destructuring
            const [rows] = await db.query(query);

            for (const row of rows) {
                // Évite toISOString sur un NULL
                const dateRetour = row.date_retour_prevue ?
                    new Date(row.date_retour_prevue).toISOString().split('T')[0] :
                    'Non spécifiée';

                const message = `Bonjour ${row.nom}, le livre "${row.titre}" est en retard (retour prévu le ${dateRetour}). Merci de le rapporter rapidement.`;

                if (row.telephone) {
                    await envoyerSMS(row.telephone, message);
                }
            }

            console.log(`📨 ${rows.length} rappel(s) envoyé(s) aujourd’hui.`);
        } catch (err) {
            console.error('❌ Erreur lors de la requête SQL dans le scheduler:', err);
        }
    });
}

module.exports = { demarrerScheduler };