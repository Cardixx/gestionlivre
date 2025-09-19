<!-- src/components/Dashboard.vue -->
<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">🎛️ Tableau de Bord Admin</h1>
    <div class="dashboard-cards">
      <router-link to="/livres" class="dashboard-card">
        <h2>📚 Livres</h2>
        <p>Gérer les livres de la bibliothèque</p>
      </router-link>

      <router-link to="/adherents" class="dashboard-card">
        <h2>👤 Adhérents</h2>
        <p>Liste et gestion des adhérents</p>
      </router-link>

      <router-link to="/prets" class="dashboard-card">
        <h2>📦 Prêts</h2>
        <p>Suivi des livres empruntés</p>
      </router-link>

      <router-link to="/statistiques" class="dashboard-card">
        <h2>📊 Statistiques</h2>
        <p>Visualiser les données</p>
      </router-link>

      <!-- Nouvelle carte pour la gestion des administrateurs -->
      <router-link to="/admins" class="dashboard-card">
        <h2>🔐 Admins</h2>
        <p>Gérer les administrateurs</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire pour l'instant
</script>

<style scoped>
/* Style existant, pas de modification nécessaire */
</style>