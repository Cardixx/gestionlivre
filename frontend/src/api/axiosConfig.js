import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000, // 10 secondes max
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

// Intercepteur pour les requêtes
instance.interceptors.request.use(config => {
    console.log(`[API] Requête vers ${config.url}`)
    return config
})

// Intercepteur pour les réponses
instance.interceptors.response.use(
    response => {
        console.log(`[API] Réponse de ${response.config.url}`, response.data)
        return response
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            error.message = 'Timeout: Le serveur a mis trop de temps à répondre'
        }

        if (!error.response) {
            error.message = 'Erreur réseau: Impossible de contacter le serveur'
        }

        return Promise.reject(error)
    }
)

export default instance