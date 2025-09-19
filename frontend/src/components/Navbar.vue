<template>
  <header class="app-header" v-if="isAuthenticated">
    <nav class="nav-container">
      <!-- Logo -->
      <div class="nav-left">
        <router-link to="/accueil" class="logo-link">
          <span class="logo-text">Bibliothèque TA</span>
        </router-link>
      </div>

      <!-- Liens de navigation -->
      <div class="nav-center">
        <router-link
          v-for="link in mainLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          active-class="nav-link-active"
        >
          {{ link.text }}
          <span v-if="link.path === '/retards' && retardsCount > 0" class="badge">
            {{ retardsCount }}
          </span>
        </router-link>
      </div>

      <!-- Boutons droite -->
      <div class="nav-right">
        <div class="user-menu">
          <button class="refresh-btn" @click="refreshApp">🔄 Actualiser</button>
          <button class="logout-btn" @click="logout">🚪 Déconnexion</button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

const router = useRouter()

// ✅ Vérifier si l’utilisateur est connecté
const isAuthenticated = computed(() => !!localStorage.getItem("authToken"))

// Liens du menu
const mainLinks = ref([
  { path: "/accueil", text: "Accueil" },
  { path: "/livres", text: "Livres" },
  { path: "/adherents", text: "Adhérents" },
  { path: "/prets", text: "Prêts" },
  { path: "/retards", text: "Retards" }
])

// Compteur de retards
const retardsCount = ref(0)

// Rafraîchir
const refreshApp = () => {
  router.go(0)
}

// Déconnexion
const logout = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userRole")
  router.push("/login")
}

// Charger le compteur des retards
const chargerRetardsCount = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/prets/retards/count")
    retardsCount.value = res.data.count
  } catch (err) {
    console.error("Erreur chargement retards:", err)
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    chargerRetardsCount()
    setInterval(chargerRetardsCount, 300000) // toutes les 5 minutes
  }
})
</script>

<style scoped>
/* mêmes styles que dans App.vue pour la navbar */
.app-header {
  background-color: #fff;
  border-bottom: 1px solid #d0d7de;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo-link {
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  color: #24292f;
}

.nav-center {
  display: flex;
  gap: 16px;
}

.nav-link {
  text-decoration: none;
  color: #24292f;
  padding: 6px 10px;
  border-radius: 6px;
}

.nav-link-active {
  font-weight: bold;
  color: #0969da;
}

.badge {
  background: red;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

.logout-btn,
.refresh-btn {
  border: 1px solid #d0d7de;
  background: white;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.logout-btn:hover,
.refresh-btn:hover {
  background: #f3f4f6;
}
</style>
