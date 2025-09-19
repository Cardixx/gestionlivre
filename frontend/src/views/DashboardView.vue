<template>
  <div class="dashboard-container">
  <h1 class="dashboard-title">🎛️ Tableau de Bord Bibliothèque Indigo</h1>
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
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire pour l'instant
</script>

<style scoped>
.dashboard-container {
  padding: 32px;
  text-align: center;
}

.dashboard-title {
  font-size: 28px;
  margin-bottom: 24px;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.dashboard-card {
  padding: 24px;
  background-color: white;
  border: 1px solid #d0d7de;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: #24292f;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.dashboard-card h2 {
  margin-bottom: 8px;
  font-size: 20px;
}
</style>
