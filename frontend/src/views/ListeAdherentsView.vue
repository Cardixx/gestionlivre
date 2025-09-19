<template>
  <div class="admin-dashboard">
    <Navbar />

    <div class="main-content">
      <div class="content-container">
        <!-- Barre d'outils -->
        <div class="toolbar">
          <h2>Gestion des Adhérents</h2>
        </div>

        <!-- Formulaire -->
        <div class="form-card">
          <h3>{{ adherentEnEdition ? 'Modifier un Adhérent' : 'Ajouter un Adhérent' }}</h3>
          <form @submit.prevent="adherentEnEdition ? modifierAdherent() : ajouterAdherent()" class="book-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input 
                  v-model="form.nom" 
                  required 
                  class="form-input" 
                  placeholder="Nom de l'adhérent" 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Prénom</label>
                <input 
                  v-model="form.prenom" 
                  required 
                  class="form-input" 
                  placeholder="Prénom de l'adhérent" 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Fonction</label>
                <input 
                  v-model="form.fonction" 
                  required 
                  class="form-input" 
                  placeholder="Fonction de l'adhérent" 
                />
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input 
                  v-model="form.telephone" 
                  required 
                  class="form-input" 
                  placeholder="+261XXXXXXXXX" 
                />
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary" type="submit">
                {{ adherentEnEdition ? 'Enregistrer' : 'Ajouter' }}
              </button>
              <button 
                v-if="adherentEnEdition" 
                @click="annulerEdition()" 
                type="button" 
                class="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        <!-- Liste des adhérents -->
        <div class="table-card">
          <div class="table-header">
            <h3>Liste des Adhérents</h3>
            <span class="book-count">{{ adherentsFiltres.length }} adhérents</span>
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
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Fonction</th>
                  <th>Téléphone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="adherent in adherentsFiltres" :key="adherent.id_adherent">
                  <td>{{ adherent.nom }}</td>
                  <td>{{ adherent.prenom }}</td>
                  <td><span class="category-tag">{{ adherent.fonction }}</span></td>
                  <td>{{ adherent.telephone }}</td>
                  <td class="actions-cell">
                    <button @click="remplirFormulaire(adherent)" class="action-btn edit-btn" title="Modifier">✏️</button>
                    <button @click="supprimerAdherent(adherent.id_adherent)" class="action-btn delete-btn" title="Supprimer">🗑️</button>
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

const adherents = ref([])
const adherentEnEdition = ref(null)
const recherche = ref('')

const form = ref({
  nom: '',
  prenom: '',
  fonction: '',
  telephone: ''
})

// Charger les adhérents depuis l'API
const chargerAdherents = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/adherents')
    adherents.value = res.data
  } catch (err) {
    console.error("Erreur de chargement :", err)
  }
}

// Filtrage par recherche
const adherentsFiltres = computed(() => {
  const r = recherche.value.toLowerCase()
  return adherents.value.filter(a => 
    a.nom?.toLowerCase().includes(r) ||
    a.prenom?.toLowerCase().includes(r) ||
    a.fonction?.toLowerCase().includes(r) ||
    a.telephone?.includes(r)
  )
})

// Ajouter un adhérent
const ajouterAdherent = async () => {
  try {
    await axios.post('http://localhost:3000/api/adherents', form.value)
    console.log("✅ Adhérent ajouté")
    resetForm()
    await chargerAdherents()
  } catch (err) {
    console.error("Erreur ajout :", err)
  }
}

// Modifier un adhérent
const modifierAdherent = async () => {
  try {
    await axios.put(`http://localhost:3000/api/adherents/${adherentEnEdition.value}`, form.value)
    console.log("✏️ Adhérent modifié")
    resetForm()
    await chargerAdherents()
  } catch (err) {
    console.error("Erreur modification :", err)
  }
}

// Supprimer un adhérent
const supprimerAdherent = async (id) => {
  if (confirm('Supprimer cet adhérent ?')) {
    try {
      await axios.delete(`http://localhost:3000/api/adherents/${id}`)
      console.log("🗑️ Supprimé")
      await chargerAdherents()
    } catch (err) {
      console.error("Erreur suppression :", err)
    }
  }
}

// Remplir le formulaire pour édition
const remplirFormulaire = (adherent) => {
  adherentEnEdition.value = adherent.id_adherent
  form.value = { ...adherent }
}

// Annuler édition
const annulerEdition = () => {
  adherentEnEdition.value = null
  resetForm()
}

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    nom: '',
    prenom: '',
    fonction: '',
    telephone: ''
  }
  adherentEnEdition.value = null
}

onMounted(chargerAdherents)
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

.category-tag {
  background-color: #ebf8ff;
  color: #3182ce;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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
