<template>
  <div class="admin-dashboard">
    <Navbar />

    <div class="main-content">
      <div class="content-container">
        <!-- Barre d'outils -->
        <div class="toolbar">
          <h2>Gestion des Livres</h2>
        </div>

        <!-- Formulaire -->
        <div class="form-card">
          <h3>{{ livreEnEdition ? 'Modifier un Livre' : 'Ajouter un Livre' }}</h3>
          <form @submit.prevent="livreEnEdition ? modifierLivre() : ajouterLivre()" class="book-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Titre</label>
                <input v-model="form.titre" required class="form-input" placeholder="Titre du livre" />
              </div>
              <div class="form-group">
                <label class="form-label">Auteur</label>
                <input v-model="form.auteur" required class="form-input" placeholder="Nom de l'auteur" />
              </div>
              <div class="form-group">
                <label class="form-label">Catégorie</label>
                <input v-model="form.categorie" required class="form-input" placeholder="Catégorie du livre" />
              </div>
              <div class="form-group">
                <label class="form-label">Année d'Édition</label>
                <input 
                  v-model.number="form.annee_edition" 
                  required 
                  class="form-input" 
                  type="number" 
                  placeholder="2025"
                  min="1900"
                  :max="new Date().getFullYear()"
                />
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary" type="submit">
                {{ livreEnEdition ? 'Enregistrer' : 'Ajouter' }}
              </button>
              <button v-if="livreEnEdition" @click="annulerEdition()" type="button" class="btn btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>

        <!-- Liste des livres -->
        <div class="table-card">
          <div class="table-header">
            <h3>Inventaire des Livres</h3>
            <span class="book-count">{{ livresFiltres.length }} livres</span>
          </div>

          <!-- Barre de recherche -->
          <div class="search-bar">
            <input
              v-model="recherche"
              type="text"
              class="search-input"
              placeholder="🔍 Recherche"
            />
          </div>

          <div class="table-responsive">
            <table class="book-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Catégorie</th>
                  <th>Année</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="livre in livresFiltres" :key="livre.id_livre">
                  <td>{{ livre.titre }}</td>
                  <td>{{ livre.auteur }}</td>
                  <td><span class="category-tag">{{ livre.categorie }}</span></td>
                  <td class="annee-edition">{{ livre.annee_edition || 'N/A' }}</td>
                  <td>
                    <span :class="{
                      'status-tag': true,
                      'available': !livre.en_pret,
                      'unavailable': livre.en_pret
                    }">
                      {{ livre.en_pret ? 'Prêté' : 'Disponible' }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button @click="remplirFormulaire(livre)" class="action-btn edit-btn" title="Modifier">✏️</button>
                    <button @click="supprimerLivre(livre.id_livre)" class="action-btn delete-btn" title="Supprimer">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from "@/components/Navbar.vue"

const livres = ref([])
const livreEnEdition = ref(null)
const recherche = ref('')

const form = ref({
  titre: '',
  auteur: '',
  categorie: '',
  annee_edition: null,
  en_pret: false
})

const chargerLivres = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/livres')
    livres.value = res.data.success ? res.data.data : []
  } catch (err) {
    console.error("Erreur de chargement : ", err)
  }
}

const livresFiltres = computed(() => {
  return livres.value.filter(livre => {
    const r = recherche.value.toLowerCase()
    return (
      livre.titre?.toLowerCase().includes(r) ||
      livre.auteur?.toLowerCase().includes(r) ||
      livre.categorie?.toLowerCase().includes(r) ||
      livre.annee_edition?.toString().includes(r)
    )
  })
})

const ajouterLivre = async () => {
  try {
    await axios.post('http://localhost:3000/api/livres', form.value)
    console.log("✅ Livre ajouté")
    resetForm()
    await chargerLivres()
  } catch (err) {
    console.error("Erreur ajout : ", err)
  }
}

const modifierLivre = async () => {
  try {
    await axios.put(`http://localhost:3000/api/livres/${livreEnEdition.value}`, form.value)
    console.log("✏️ Livre modifié")
    resetForm()
    await chargerLivres()
  } catch (err) {
    console.error("Erreur modif : ", err)
  }
}

const supprimerLivre = async (id) => {
  if (confirm('Supprimer ce livre ?')) {
    try {
      await axios.delete(`http://localhost:3000/api/livres/${id}`)
      console.log("🗑️ Supprimé")
      await chargerLivres()
    } catch (err) {
      console.error("Erreur suppression : ", err)
    }
  }
}

const remplirFormulaire = (livre) => {
  livreEnEdition.value = livre.id_livre
  form.value = { ...livre, annee_edition: Number(livre.annee_edition) }
}

const annulerEdition = () => {
  livreEnEdition.value = null
  resetForm()
}

const resetForm = () => {
  form.value = {
    titre: '',
    auteur: '',
    categorie: '',
    annee_edition: null,
    en_pret: false
  }
}

onMounted(chargerLivres)
</script>

<style scoped>
.main-content {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  margin-bottom: 20px;
}

.toolbar h2 {
  color: #2c3e50;
  font-size: 24px;
}

.form-card, .table-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

.form-card h3, .table-header h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.book-form {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a5568;
}

.form-input {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
}

.btn-primary:hover {
  background-color: #3182ce;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.book-count {
  background-color: #edf2f7;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 14px;
  color: #4a5568;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
}

.table-responsive {
  overflow-x: auto;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
}

.book-table th {
  text-align: left;
  padding: 12px 15px;
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

.book-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
}

.annee-edition {
  text-align: center;
  font-family: monospace;
  color: #4a5568;
}

.category-tag {
  background-color: #ebf8ff;
  color: #3182ce;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.available {
  background-color: #f0fff4;
  color: #38a169;
}

.unavailable {
  background-color: #fff5f5;
  color: #e53e3e;
}

.actions-cell {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
}

.edit-btn {
  color: #4299e1;
}

.delete-btn {
  color: #e53e3e;
}
</style>