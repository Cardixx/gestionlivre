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

          <!-- Barre de filtre avancé -->
          <div class="search-bar advanced-filter">
            <input v-model="filtre.titre" type="text" class="search-input" placeholder="Titre" />
            <input v-model="filtre.auteur" type="text" class="search-input" placeholder="Auteur" />
            <input v-model="filtre.categorie" type="text" class="search-input" placeholder="Catégorie" />
            <input v-model="filtre.annee" type="number" class="search-input" placeholder="Année" min="1900" :max="new Date().getFullYear()" />
            <select v-model="filtre.statut" class="search-input">
              <option value="">Tous</option>
              <option value="disponible">Disponible</option>
              <option value="prete">Prêté</option>
            </select>
          </div>

          <div class="table-responsive">
            <table class="book-table">
              <thead>
                <tr>
                  <th @click="setSort('titre')" style="cursor:pointer">Titre <span v-if="sort.key==='titre'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('auteur')" style="cursor:pointer">Auteur <span v-if="sort.key==='auteur'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('categorie')" style="cursor:pointer">Catégorie <span v-if="sort.key==='categorie'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('annee_edition')" style="cursor:pointer">Année <span v-if="sort.key==='annee_edition'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
                  <th @click="setSort('statut')" style="cursor:pointer">Statut <span v-if="sort.key==='statut'">{{ sort.order==='asc'?'▲':'▼' }}</span></th>
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

const livres = ref([])
const livreEnEdition = ref(null)
const recherche = ref('')
const filtre = ref({
  titre: '',
  auteur: '',
  categorie: '',
  annee: '',
  statut: ''
})

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
  let filtered = livres.value.filter(livre => {
    // Recherche globale
    const r = recherche.value.toLowerCase();
    const matchRecherche =
      livre.titre?.toLowerCase().includes(r) ||
      livre.auteur?.toLowerCase().includes(r) ||
      livre.categorie?.toLowerCase().includes(r) ||
      livre.annee_edition?.toString().includes(r);

    // Contrôle des champs de filtre
    if (filtre.value.annee && (isNaN(Number(filtre.value.annee)) || Number(filtre.value.annee) < 1900 || Number(filtre.value.annee) > new Date().getFullYear())) return false;
    if (filtre.value.statut && !['disponible','prete',''].includes(filtre.value.statut)) return false;

    // Filtres avancés
    const matchTitre = filtre.value.titre === '' || livre.titre?.toLowerCase().includes(filtre.value.titre.toLowerCase());
    const matchAuteur = filtre.value.auteur === '' || livre.auteur?.toLowerCase().includes(filtre.value.auteur.toLowerCase());
    const matchCategorie = filtre.value.categorie === '' || livre.categorie?.toLowerCase().includes(filtre.value.categorie.toLowerCase());
    const matchAnnee = filtre.value.annee === '' || livre.annee_edition?.toString() === filtre.value.annee.toString();
    const matchStatut =
      filtre.value.statut === '' ||
      (filtre.value.statut === 'disponible' && !livre.en_pret) ||
      (filtre.value.statut === 'prete' && livre.en_pret);

    return matchRecherche && matchTitre && matchAuteur && matchCategorie && matchAnnee && matchStatut;
  });

  // Triage
  if (sort.value.key) {
    filtered = filtered.slice().sort((a, b) => {
      let va, vb;
      if (sort.value.key === 'statut') {
        va = a.en_pret ? 1 : 0;
        vb = b.en_pret ? 1 : 0;
      } else {
        va = a[sort.value.key];
        vb = b[sort.value.key];
      }
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