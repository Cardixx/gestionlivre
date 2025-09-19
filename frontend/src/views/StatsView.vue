<template>
  <div class="main-content">
    <div class="content-container">
      <!-- Barre d'outils -->
      <div class="toolbar">
        <h2>Statistiques de la Bibliothèque</h2>
        <span class="updated">Dernière mise à jour : {{ formatDate(stats.lastUpdated) }}</span>
      </div>

      <!-- Grille de statistiques -->
      <div class="stats-grid">
        <!-- Total Livres -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">📚</span>
            <h3 class="stat-title">Total Livres</h3>
          </div>
          <div class="stat-value">{{ stats.totalLivres }}</div>
          <div class="stat-detail">Tous les livres enregistrés</div>
        </div>

        <!-- Livres Disponibles -->
        <div class="stat-card border-green">
          <div class="stat-header">
            <span class="stat-icon">📗</span>
            <h3 class="stat-title">Livres Disponibles</h3>
          </div>
          <div class="stat-value">{{ stats.livresDisponibles }}</div>
          <div class="stat-detail">Actuellement en rayon</div>
        </div>

        <!-- Livres Empruntés -->
        <div class="stat-card border-red">
          <div class="stat-header">
            <span class="stat-icon">📕</span>
            <h3 class="stat-title">Livres Empruntés</h3>
          </div>
          <div class="stat-value">{{ stats.livresEmpruntes }}</div>
          <div class="stat-detail">Actuellement prêtés</div>
        </div>

        <!-- Total Adhérents -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">👥</span>
            <h3 class="stat-title">Total Adhérents</h3>
          </div>
          <div class="stat-value">{{ stats.totalAdherents }}</div>
          <div class="stat-detail">Membres enregistrés</div>
        </div>

        <!-- Prêts en cours -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">📦</span>
            <h3 class="stat-title">Prêts en cours</h3>
          </div>
          <div class="stat-value">{{ stats.pretsEnCours }}</div>
          <div class="stat-detail">Prêts actifs</div>
        </div>

        <!-- Prêts en retard -->
        <div class="stat-card border-orange">
          <div class="stat-header">
            <span class="stat-icon">⏰</span>
            <h3 class="stat-title">Prêts en retard</h3>
          </div>
          <div class="stat-value">{{ stats.pretsEnRetard }}</div>
          <div class="stat-detail">À retourner</div>
        </div>

        <!-- Dernier Livre -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">📖</span>
            <h3 class="stat-title">Dernier Livre</h3>
          </div>
          <div class="stat-value truncate">{{ stats.dernierLivre?.titre }}</div>
          <div class="stat-detail">{{ stats.dernierLivre?.auteur }}</div>
        </div>

        <!-- Adhérent actif -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-icon">🏆</span>
            <h3 class="stat-title">Adhérent actif</h3>
          </div>
          <div class="stat-value truncate">{{ stats.adherentActif?.nom }}</div>
          <div class="stat-detail">{{ stats.adherentActif?.nb_prets }} prêt(s)</div>
        </div>
      </div>

      <!-- Liste des livres en retard -->
      <div class="data-section">
        <h3>Livres en retard ({{ stats.pretsEnRetard }})</h3>
        <div class="data-info" v-if="stats.pretsEnRetard === 0">
          Aucun livre en retard actuellement.
        </div>
        <div class="data-table-container" v-else>
          <table class="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Emprunté par</th>
                <th>Date emprunt</th>
                <th>Retour prévu</th>
                <th>Jours de retard</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="livre in stats.livresEnRetard" :key="livre.id_pret" class="late-row">
                <td>{{ livre.titre }}</td>
                <td>{{ livre.auteur }}</td>
                <td>{{ livre.nom_adherent }}</td>
                <td>{{ formatDate(livre.date_emprunt) }}</td>
                <td>{{ formatDate(livre.date_retour_prevue) }}</td>
                <td class="late-days">{{ livre.jours_retard }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Liste des livres empruntés -->
      <div class="data-section">
        <h3>Livres actuellement empruntés ({{ stats.pretsEnCours }})</h3>
        <div class="data-info" v-if="stats.pretsEnCours === 0">
          Aucun livre emprunté actuellement.
        </div>
        <div class="data-table-container" v-else>
          <table class="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Emprunté par</th>
                <th>Date emprunt</th>
                <th>Retour prévu</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="livre in stats.livresEmpruntesList" :key="livre.id_pret"
                  :class="{'late-row': isLate(livre.date_retour_prevue)}">
                <td>{{ livre.titre }}</td>
                <td>{{ livre.auteur }}</td>
                <td>{{ livre.nom_adherent }}</td>
                <td>{{ formatDate(livre.date_emprunt) }}</td>
                <td>{{ formatDate(livre.date_retour_prevue) }}</td>
                <td>
                  <span v-if="isLate(livre.date_retour_prevue)" class="status-badge late">
                    En retard ({{ daysLate(livre.date_retour_prevue) }}j)
                  </span>
                  <span v-else class="status-badge on-time">
                    En cours
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  livresEnRetard: [],
  livresEmpruntesList: []
})

const chargerStats = () => {
  axios.get('http://localhost:3000/api/statistiques')
    .then(res => stats.value = res.data.data)
    .catch(() => alert('Erreur chargement statistiques'))
}

onMounted(chargerStats)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

const isLate = (returnDate) => {
  if (!returnDate) return false
  const today = new Date()
  const returnDateObj = new Date(returnDate)
  return returnDateObj < today
}

const daysLate = (returnDate) => {
  if (!returnDate) return 0
  const today = new Date()
  const returnDateObj = new Date(returnDate)
  const diffTime = today - returnDateObj
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}
</script>

<style scoped>
.main-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #24292f;
  line-height: 1.5;
  padding: 20px;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #d0d7de;
}

.toolbar h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #24292f;
}

.updated {
  font-size: 14px;
  color: #57606a;
  background-color: #e8f4fc;
  padding: 4px 10px;
  border-radius: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #d0d7de;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.border-green {
  border-top: 3px solid #1a7f37;
}

.border-red {
  border-top: 3px solid #cf222e;
}

.border-orange {
  border-top: 3px solid #d4a72c;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.stat-icon {
  font-size: 24px;
}

.stat-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #24292f;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #24292f;
  margin-bottom: 5px;
}

.stat-detail {
  font-size: 14px;
  color: #57606a;
  margin-top: 4px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.data-section {
  margin-top: 30px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #d0d7de;
}

.data-section h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #d0d7de;
}

.data-table-container {
  overflow-x: auto;
  margin-top: 15px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px 15px;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
}

.data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eaecef;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #f6f8fa;
}

.data-info {
  padding: 15px;
  color: #57606a;
  text-align: center;
}

.late-row {
  background-color: #fff8f8;
}

.late-row:hover {
  background-color: #ffebeb;
}

.late-days {
  color: #cf222e;
  font-weight: bold;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.on-time {
  background-color: #e6f7ee;
  color: #1a7f37;
}

.status-badge.late {
  background-color: #ffebe9;
  color: #cf222e;
}
</style>