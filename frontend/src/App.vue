<template>
  <div id="app">
    <!-- ✅ Barre de navigation -->
    

    <!-- ✅ Contenu principal -->
    <main class="app-main">
      <div class="main-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- ✅ Footer -->
    <footer class="app-footer" v-if="isAuthenticated">
      <div class="footer-container">
        <div class="footer-links">
          <a href="#" class="footer-link">Conditions d'utilisation</a>
          <a href="#" class="footer-link">Politique de confidentialité</a>
          <a href="#" class="footer-link">Aide</a>
        </div>
        <p class="copyright">© {{ currentYear }} Bibliothèque du Tribunal Administratif</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// ✅ Liens du menu (uniquement visibles si connecté)
const mainLinks = ref([
  { path: '/accueil', text: 'Accueil' },
  { path: '/livres', text: 'Livres' },
  { path: '/adherents', text: 'Adhérents' },
  { path: '/prets', text: 'Prêts' },
  { path: '/retards', text: 'Retards' }
])

// ✅ Variables globales
const currentYear = computed(() => new Date().getFullYear())
const retardsCount = ref(0)

// ✅ Vérifie si utilisateur connecté
const isAuthenticated = computed(() => !!localStorage.getItem('authToken'))

// ✅ Actualiser la page
const refreshApp = () => {
  router.go(0)
}

// ✅ Déconnexion
const logout = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userRole")
  router.push("/login")
}

// ✅ Charger nombre de retards
const chargerRetardsCount = async () => {
  if (!isAuthenticated.value) return
  try {
    const response = await axios.get('http://localhost:3000/api/prets/retards/count')
    retardsCount.value = response.data.count
  } catch (error) {
    console.error("Erreur chargement nombre de retards:", error)
  }
}

onMounted(() => {
  chargerRetardsCount()
  setInterval(chargerRetardsCount, 300000) // toutes les 5 min
})
</script>

<style>
/* 🌐 Variables CSS */
:root {
  --primary-color: #24292f;
  --secondary-color: #0969da;
  --bg-color: #ffffff;
  --text-color: #24292f;
  --text-secondary: #57606a;
  --border-color: #d0d7de;
  --border-radius: 6px;
  --hover-bg: rgba(175, 184, 193, 0.2);
  --alert-color: #e53935;
}

/* Reset */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; background: #f6f8fa; }

/* Structure */
#app { display: flex; flex-direction: column; min-height: 100vh; }
.app-header { background: var(--bg-color); border-bottom: 1px solid var(--border-color); padding: 0 16px; }
.nav-container { display: flex; justify-content: space-between; align-items: center; height: 64px; }
.logo-link { font-weight: bold; font-size: 16px; text-decoration: none; color: var(--text-color); }
.nav-center { display: flex; gap: 16px; }
.nav-link { text-decoration: none; color: var(--text-color); padding: 8px 12px; border-radius: var(--border-radius); }
.nav-link:hover { background: var(--hover-bg); }
.nav-link-active { color: var(--secondary-color); font-weight: bold; }
.badge { background: var(--alert-color); color: white; border-radius: 10px; padding: 2px 6px; font-size: 11px; margin-left: 6px; }
.user-menu { display: flex; gap: 10px; }

/* Boutons */
.refresh-btn, .logout-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 600;
}
.refresh-btn:hover, .logout-btn:hover { background: var(--hover-bg); }

/* Main + Footer */
.app-main { flex: 1; padding: 20px; }
.app-footer { background: var(--bg-color); border-top: 1px solid var(--border-color); padding: 20px; text-align: center; font-size: 12px; }
</style>
