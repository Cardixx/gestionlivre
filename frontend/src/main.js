import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Configuration Axios
axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Intercepteur Axios pour l'authentification
axios.interceptors.request.use(config => {
    const authStore = useAuthStore()
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
})



// Initialisation avant le montage
router.isReady().then(() => {
    const authStore = useAuthStore()

    // Initialiser l'état d'authentification
    authStore.initializeFromStorage()

    // Redirection si non authentifié
    if (!authStore.isAuthenticated && !router.currentRoute.value.meta.public) {
        router.replace('/login')
    }

    app.mount('#app')
})

// Gestion des erreurs globales
app.config.errorHandler = (err) => {
    console.error('Erreur globale:', err)
}