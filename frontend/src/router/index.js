import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Accueil from '../views/Accueil.vue'
import ListeLivresView from '../views/ListeLivresView.vue'
import ListeAdherentsView from '../views/ListeAdherentsView.vue'
import GestionPretsView from '../views/GestionPretsView.vue'
import DashboardView from '../views/DashboardView.vue'
import StatsView from '../views/StatsView.vue'
import RetardsView from '../views/RetardsView.vue'
import GestionAdmins from '../views/GestionAdmins.vue'

const routes = [{
        path: '/',
        redirect: () => {
            return localStorage.getItem('authToken') ? '/accueil' : '/login'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            title: 'Connexion',
            public: true,
            hideWhenAuth: true
        }
    },
    {
        path: '/accueil',
        name: 'accueil',
        component: Accueil,
        meta: {
            title: 'Accueil',
            requiresAuth: true
        }
    },
    {
        path: '/livres',
        name: 'livres',
        component: ListeLivresView,
        meta: {
            title: 'Gestion des livres',
            requiresAuth: true
        }
    },
    {
        path: '/adherents',
        name: 'adherents',
        component: ListeAdherentsView,
        meta: {
            title: 'Gestion des adhérents',
            requiresAuth: true
        }
    },
    {
        path: '/prets',
        name: 'prets',
        component: GestionPretsView,
        meta: {
            title: 'Gestion des prêts',
            requiresAuth: true
        }
    },
    {
        path: '/retards',
        name: 'retards',
        component: RetardsView,
        meta: {
            title: 'Gestion des retards',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: {
            title: 'Tableau de bord',
            requiresAuth: true,
            adminOnly: true
        }
    },
    {
        path: '/stats',
        name: 'stats',
        component: StatsView,
        meta: {
            title: 'Statistiques',
            requiresAuth: true,
            adminOnly: true
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: GestionAdmins,
        meta: {
            title: 'Gestion des admins',
            requiresAuth: true,
            adminOnly: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    }
})

// ✅ Middleware de sécurité (auth + admin)
router.beforeEach((to, from, next) => {
    document.title = to.meta.title ?
        `${to.meta.title} | Bibliothèque TA` :
        'Bibliothèque TA'

    const authToken = localStorage.getItem('authToken')
    const isAuthenticated = !!authToken
        // 👉 comme seul le président utilise, on force son rôle = admin
    const isAdmin = isAuthenticated

    // Route publique
    if (to.meta.public) {
        if (to.meta.hideWhenAuth && isAuthenticated) {
            return next('/accueil')
        }
        return next()
    }

    // Vérification de connexion
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }

    // Vérification admin (dans notre cas le président)
    if (to.meta.adminOnly && !isAdmin) {
        return next('/accueil')
    }

    next()
})

export default router