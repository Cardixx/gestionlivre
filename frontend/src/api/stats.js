import axios from './axiosConfig';

export const fetchStatistics = async() => {
    try {
        const response = await axios.get('/statistiques');

        if (!response.data.success) {
            throw new Error(response.data.error || 'Réponse serveur invalide');
        }

        return response.data.data;
    } catch (error) {
        // Journalisation détaillée
        console.error('[API Error]', {
            url: error.config ? .url,
            status: error.response ? .status,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });

        // Message d'erreur clair
        let errorMessage = 'Erreur réseau';
        if (error.response) {
            errorMessage = error.response.data ? .error ||
                error.response.data ? .message ||
                `Erreur ${error.response.status}`;
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
};