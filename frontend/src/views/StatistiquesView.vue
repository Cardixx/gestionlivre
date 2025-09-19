<template>
  <div class="statistiques-view">
    <h1 class="page-title">📊 Statistiques de la Bibliothèque</h1>
    
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-alert">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button @click="fetchStats" class="retry-btn">Réessayer</button>
      </div>
    </div>
    
    <div v-else class="stats-grid">
      <StatCard
        title="Livres"
        :value="stats.totalLivres"
        icon="📚"
      >
        <template #details>
          <span class="available">{{ stats.livresDisponibles }} disponibles</span>
          <span class="borrowed">{{ stats.livresEmpruntes }} empruntés</span>
        </template>
      </StatCard>
      
      <StatCard
        title="Adhérents"
        :value="stats.totalAdherents"
        icon="👤"
      />
      
      <StatCard
        title="Prêts en cours"
        :value="stats.pretsEnCours"
        icon="🔄"
      >
        <template #details>
          <span class="late">{{ stats.pretsEnRetard }} en retard</span>
        </template>
      </StatCard>
      
      <StatCard
        v-if="stats.dernierLivre"
        title="Dernier livre ajouté"
        :value="stats.dernierLivre.titre"
        icon="🆕"
        highlight
      >
        <template #details>
          <span>Auteur: {{ stats.dernierLivre.auteur }}</span>
        </template>
      </StatCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { fetchStatistics } from '@/api/stats'

const stats = ref({
  totalLivres: 0,
  livresDisponibles: 0,
  livresEmpruntes: 0,
  totalAdherents: 0,
  pretsEnCours: 0,
  pretsEnRetard: 0,
  dernierLivre: null
})

const loading = ref(true)
const error = ref(null)

const fetchStats = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetchStatistics()
    
    stats.value = {
      ...response,
      livresEmpruntes: response.totalLivres - response.livresDisponibles
    }
    
  } catch (err) {
    console.error('Erreur:', err)
    error.value = err.message || 'Erreur lors du chargement des statistiques'
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<style scoped>
.statistiques-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-container {
  margin: 2rem 0;
}

.error-alert {
  background: #ffebee;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
  font-size: 2rem;
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #3aa876;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.available { color: #42b983; }
.borrowed { color: #f39c12; }
.late { color: #e74c3c; }

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>