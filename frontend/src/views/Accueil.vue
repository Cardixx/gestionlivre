<template>
  <div class="page-wrapper">
    <Navbar />
    <div class="admin-dashboard">
      <div class="header-container">
        <h1 class="title">
          <span class="icon">📚</span> Bibliothèque du Tribunal Administratif
        </h1>
        <p class="subtitle">
          Portail documentaire officiel - Statistiques et gestion des prêts
        </p>
      </div>

      <div class="stats-grid">
        <!-- Carte Statistique Principale -->
        <div class="main-stat-card">
          <div class="stat-header">
            <span class="stat-icon">📊</span>
            <h2>Statistiques Globales</h2>
            <span class="updated">Mise à jour : {{ formatDate(stats.lastUpdated) }}</span>
          </div>
          <div class="main-stats">
            <div class="main-stat">
              <div class="stat-value">{{ stats.totalLivres }}</div>
              <div class="stat-label">Ouvrages référencés</div>
            </div>
            <div class="main-stat">
              <div class="stat-value">{{ stats.totalAdherents }}</div>
              <div class="stat-label">Utilisateurs habilités</div>
            </div>
            <div class="main-stat">
              <div class="stat-value">{{ stats.pretsEnCours }}</div>
              <div class="stat-label">Prêts actifs</div>
            </div>
          </div>
        </div>

        <!-- Cartes Secondaires -->
        <div class="stat-card availability-card">
          <div class="stat-header">
            <span class="stat-icon">📗</span>
            <h3>Disponibilité</h3>
          </div>
          <div class="stat-content">
            <div class="availability-stats">
              <div class="availability-stat available">
                <div class="stat-value">{{ stats.livresDisponibles }}</div>
                <div class="stat-label">Disponibles</div>
              </div>
              <div class="availability-stat unavailable">
                <div class="stat-value">{{ stats.livresEmpruntes }}</div>
                <div class="stat-label">Empruntés</div>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: availabilityPercentage + '%' }"></div>
            </div>
            <div class="percentage">{{ availabilityPercentage }}% disponibles</div>
          </div>
        </div>

        <div class="stat-card late-card">
          <div class="stat-header">
            <span class="stat-icon">⏰</span>
            <h3>Retards</h3>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pretsEnRetard }}</div>
            <div class="stat-label">Prêts en retard</div>
            <div class="late-details">
              <span v-if="stats.pretsEnRetard > 0" class="warning-text">
                {{ oldestLateDays }} jour(s) de retard maximum
              </span>
              <span v-else class="success-text">
                Aucun retard enregistré
              </span>
            </div>
          </div>
        </div>

        <!-- Dernières Activités -->
        <div class="data-card activity-card">
          <div class="card-header">
            <h3><span class="icon">📝</span> Dernières Activités</h3>
          </div>
          <div class="card-content">
            <div class="activity-item">
              <div class="activity-icon">📖</div>
              <div class="activity-details">
                <p>Nouvel ouvrage référencé</p>
                <span class="activity-meta">{{ stats.dernierLivre?.titre }} - {{ formatDate(stats.lastUpdated) }}</span>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">👤</div>
              <div class="activity-details">
                <p>Utilisateur le plus actif</p>
                <span class="activity-meta">{{ stats.adherentActif?.nom }} ({{ stats.adherentActif?.nb_prets }} prêts)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="notice-box">
        <span class="notice-icon">ℹ️</span>
        <span>Ce tableau de bord est actualisé automatiquement - Données à jour au {{ formatDate(stats.lastUpdated) }}</span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from "@/components/Navbar.vue"

const stats = ref({
  totalLivres: 0,
  livresDisponibles: 0,
  livresEmpruntes: 0,
  totalAdherents: 0,
  pretsEnCours: 0,
  pretsEnRetard: 0,
  dernierLivre: null,
  adherentActif: null,
  livresEnRetard: [],
  lastUpdated: null
})

const chargerStats = () => {
  axios.get('http://localhost:3000/api/statistiques')
    .then(res => stats.value = res.data.data)
    .catch(() => alert('Erreur lors du chargement des statistiques'))
}

onMounted(chargerStats)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const availabilityPercentage = computed(() => {
  if (stats.value.totalLivres === 0) return 0
  return Math.round((stats.value.livresDisponibles / stats.value.totalLivres) * 100)
})

const oldestLateDays = computed(() => {
  if (!stats.value.livresEnRetard || stats.value.livresEnRetard.length === 0) return 0
  return Math.max(...stats.value.livresEnRetard.map(item => item.jours_retard))
})
</script>

<style scoped>
/* Styles inchangés par rapport à votre version précédente */
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
}

.header-container {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.icon {
  margin-right: 1rem;
  font-size: 2rem;
}

.subtitle {
  font-size: 1rem;
  color: #4a5568;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.main-stat-card {
  grid-column: span 8;
  background-color: #fff;
  border: 1px solid #d6d8db;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-card {
  grid-column: span 4;
  background-color: #fff;
  border: 1px solid #d6d8db;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.data-card {
  grid-column: span 6;
  background-color: #fff;
  border: 1px solid #d6d8db;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stat-header h2, .stat-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.stat-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #3a5a78;
}

.updated {
  margin-left: auto;
  font-size: 0.8rem;
  color: #718096;
  background-color: #f8fafc;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
}

.main-stats {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.main-stat {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

.availability-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.availability-stat {
  flex: 1;
  padding: 0.8rem;
  border-radius: 4px;
}

.available {
  background-color: #f0fdf4;
  border-left: 4px solid #16a34a;
}

.unavailable {
  background-color: #fff1f2;
  border-left: 4px solid #e11d48;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background-color: #3a5a78;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.percentage {
  font-size: 0.9rem;
  color: #64748b;
  text-align: center;
}

.late-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
}

.warning-text {
  color: #dc2626;
  font-weight: 500;
}

.success-text {
  color: #16a34a;
}

.card-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.card-content {
  padding: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #64748b;
  text-align: center;
}

.empty-state .icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th {
  text-align: left;
  padding: 0.8rem;
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 500;
}

.data-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #e2e8f0;
}

.ref-cell {
  font-family: monospace;
  color: #3a5a78;
}

.late-cell {
  color: #dc2626;
  font-weight: 500;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.2rem;
  color: #3a5a78;
}

.activity-details p {
  margin: 0 0 0.2rem 0;
  font-weight: 500;
}

.activity-meta {
  font-size: 0.8rem;
  color: #64748b;
}

.notice-box {
  background-color: #f0f7ff;
  border: 1px solid #d0e3ff;
  border-radius: 4px;
  padding: 1rem;
  font-size: 0.9rem;
  color: #3a5a78;
  display: flex;
  align-items: center;
}

.notice-icon {
  margin-right: 0.8rem;
  font-size: 1.2rem;
}

@media (max-width: 1024px) {
  .main-stat-card {
    grid-column: span 12;
  }
  
  .stat-card {
    grid-column: span 6;
  }
  
  .data-card {
    grid-column: span 12;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .main-stat-card, .stat-card, .data-card {
    grid-column: span 1;
  }
  
  .main-stats, .availability-stats {
    flex-direction: column;
  }
  
  .title {
    font-size: 1.5rem;
  }
}
</style>