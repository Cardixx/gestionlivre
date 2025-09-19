// services/checkLateLoans.js
const db = require('../config/db');
const { envoyerSMS } = require('../utils/sms');
const cron = require('node-cron');

function demarrerScheduler() {
    // Tous les jours à 8h du matin
    cron.schedule('0 8 * * *', () => {
        console.log('⏰ Vérification des prêts en retard...');

        const query = `
      SELECT a.nom, a.telephone, l.titre, p.date_retour_prevue
      FROM pret p
      JOIN adherent a ON p.id_adherent = a.id_adherent
      JOIN livre l ON p.id_livre = l.id_livre
      WHERE p.date_retour_effective IS NULL
        AND p.date_retour_prevue < NOW()
    `;

        db.query(query, async(err, results) => {
            if (err) {
                console.error('❌ Erreur SQL :', err);
                return;
            }

            if (results.length === 0) {
                console.log('📭 Aucun prêt en retard pour aujourd’hui.');
                return;
            }

            for (const pret of results) {
                const dateRetour = pret.date_retour_prevue.toISOString().split('T')[0];
                const message = `📚 Bonjour ${pret.nom}, le livre "${pret.titre}" est en retard (retour prévu le ${dateRetour}). Merci de le retourner rapidement.`;
                await envoyerSMS(pret.telephone, message);
            }

            console.log(`✅ ${results.length} rappel(s) envoyé(s) par SMS.`);
        });
    }, {
        timezone: 'Africa/Nairobi' // GMT+3 (Madagascar)
    });
}

module.exports = demarrerScheduler;