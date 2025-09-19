// 📱 utils/sms.js

const twilio = require('twilio');
require('dotenv').config(); // Assure que les variables sont bien chargées

const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
} = process.env;

// ✅ Vérification des variables d'environnement
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('❌ Erreur: variables Twilio manquantes dans .env');
    process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * 📩 Envoie un SMS via Twilio
 * @param {string} numero - Numéro au format international (+261xxxxxxxx)
 * @param {string} message - Contenu du SMS à envoyer
 */
async function envoyerSMS(numero, message) {
    if (!numero || !message) {
        console.warn('⚠️ Numéro ou message manquant pour l’envoi SMS');
        return;
    }

    try {
        const res = await client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: numero
        });

        console.log(`📨 SMS envoyé à ${numero} ✅ (SID: ${res.sid})`);
    } catch (error) {
        console.error(`❌ Erreur lors de l’envoi du SMS à ${numero}:`, error.message);
    }
}

module.exports = { envoyerSMS };