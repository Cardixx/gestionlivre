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
                  placeholder="XXXXXXXXXX" 
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

          <!-- Barre de filtre avancé -->
          <div class="search-bar advanced-filter">
            <input v-model="filtre.nom" type="text" class="search-input" placeholder="Nom" />
            <input v-model="filtre.prenom" type="text" class="search-input" placeholder="Prénom" />
            <input v-model="filtre.fonction" type="text" class="search-input" placeholder="Fonction" />
            <input v-model="filtre.telephone" type="text" class="search-input" placeholder="Téléphone" />
          </div>

          <div class="table-responsive">
            <table class="book-table">
              <thead>
                <tr>
                  <th @click="setSort('nom')" style="cursor:pointer">Nom <span v-if="sort.key==='nom'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('prenom')" style="cursor:pointer">Prénom <span v-if="sort.key==='prenom'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('fonction')" style="cursor:pointer">Fonction <span v-if="sort.key==='fonction'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('telephone')" style="cursor:pointer">Téléphone <span v-if="sort.key==='telephone'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
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
const sort = ref({ key: '', order: 'asc' })

function setSort(key) {
  if (sort.value.key === key) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sort.value.key = key;
    sort.value.order = 'asc';
  }
}
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Navbar from "@/components/Navbar.vue"

const adherents = ref([])
const adherentEnEdition = ref(null)
const recherche = ref('')
const filtre = ref({
  nom: '',
  prenom: '',
  fonction: '',
  telephone: ''
})

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
  let filtered = adherents.value.filter(a => {
    // Recherche globale
    const r = recherche.value.toLowerCase();
    const matchRecherche =
      a.nom?.toLowerCase().includes(r) ||
      a.prenom?.toLowerCase().includes(r) ||
      a.fonction?.toLowerCase().includes(r) ||
      a.telephone?.includes(r);

    // Contrôle des champs de filtre
    if (filtre.value.telephone && !/^\d{8,15}$/.test(filtre.value.telephone)) return false;

    // Filtres avancés
    const matchNom = filtre.value.nom === '' || a.nom?.toLowerCase().includes(filtre.value.nom.toLowerCase());
    const matchPrenom = filtre.value.prenom === '' || a.prenom?.toLowerCase().includes(filtre.value.prenom.toLowerCase());
    const matchFonction = filtre.value.fonction === '' || a.fonction?.toLowerCase().includes(filtre.value.fonction.toLowerCase());
    const matchTelephone = filtre.value.telephone === '' || a.telephone?.includes(filtre.value.telephone);

    return matchRecherche && matchNom && matchPrenom && matchFonction && matchTelephone;
  });

  // Triage
  if (sort.value.key) {
    filtered = filtered.slice().sort((a, b) => {
      let va = a[sort.value.key], vb = b[sort.value.key];
      if (va == null) va = '';
      if (vb == null) vb = '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sort.value.order === 'asc' ? -1 : 1;
      if (va > vb) return sort.value.order === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return filtered;
});

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
