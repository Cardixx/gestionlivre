<template>
  <div class="admin-dashboard">
    <Navbar />

    <div class="main-content">
      <div class="content-container">

        <!-- Barre d'outils -->
        <div class="toolbar">
          <h2>Gestion des Prêts</h2>
        </div>

        <!-- Formulaire -->
        <div class="form-card">
          <h3>Nouveau Prêt</h3>
          <form @submit.prevent="ajouterPret" class="book-form">
            <div class="form-grid">
              <!-- Adhérent -->
              <div class="form-group">
                <label class="form-label">Adhérent</label>
                <select v-model="form.id_adherent" required class="form-input">
                  <option disabled value="">👤 Choisir un adhérent</option>
                  <option v-for="a in adherents" :key="a.id_adherent" :value="a.id_adherent">
                    {{ a.nom }} {{ a.prenom }}
                  </option>
                </select>
              </div>

              <!-- Livre -->
              <div class="form-group">
                <label class="form-label">Livre</label>
                <select v-model="form.id_livre" required class="form-input">
                  <option disabled value="">📚 Choisir un livre</option>
                  <option v-for="l in livres" :key="l.id_livre" :value="l.id_livre">
                    {{ l.titre }}
                  </option>
                </select>
              </div>

              <!-- Date prêt -->
              <div class="form-group">
                <label class="form-label">Date de prêt</label>
                <input type="date" v-model="form.date_pret" required class="form-input" />
              </div>

              <!-- Retour prévu -->
              <div class="form-group">
                <label class="form-label">Retour prévu</label>
                <input type="date" v-model="form.date_retour_prevue" required class="form-input" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                <span class="btn-icon">➕</span> Enregistrer le prêt
              </button>
            </div>
          </form>
        </div>

        <!-- Liste des prêts -->
        <div class="table-card">
          <div class="table-header">
            <h3>Prêts en cours</h3>
            <span class="book-count">{{ pretsFiltres.length }} prêts</span>
          </div>

          <!-- Barre de filtre avancé -->
          <div class="search-bar advanced-filter">
            <input v-model="filtre.adherent" type="text" class="search-input" placeholder="Adhérent" />
            <input v-model="filtre.livre" type="text" class="search-input" placeholder="Livre" />
            <input v-model="filtre.datePret" type="date" class="search-input" placeholder="Date prêt" />
            <input v-model="filtre.dateRetour" type="date" class="search-input" placeholder="Retour prévu" />
          </div>

          <div class="table-responsive">
            <table class="book-table">
              <thead>
                <tr>
                  <th>Adhérent</th>
                  <th>Livre</th>
                  <th>Date prêt</th>
                  <th>Retour prévu</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pret in pretsFiltres" :key="pret.id_pret">
                  <td>{{ pret.nom_adherent }} {{ pret.prenom_adherent }}</td>
                  <td>{{ pret.titre_livre }}</td>
                  <td>{{ formatDate(pret.date_pret) }}</td>
                  <td>
                    <span :class="{
                      'status-tag': true,
                      'available': !isDatePassed(pret.date_retour_prevue),
                      'unavailable': isDatePassed(pret.date_retour_prevue)
                    }">
                      {{ formatDate(pret.date_retour_prevue) }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button @click="retournerLivre(pret.id_pret)" class="action-btn return-btn" title="Retourner">
                      <svg class="action-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2.5a5.5 5.5 0 00-3.89 9.39l-.7.7a.75.75 0 101.06 1.06l.7-.7A5.5 5.5 0 008 2.5zm-2.47 8.97a4 4 0 112.83-6.83l-1.06 1.06a.75.75 0 001.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25a.75.75 0 00-1.06 1.06l1.06 1.06a4 4 0 01-2.83 6.83z"/>
                      </svg>
                    </button>
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
import { computed } from 'vue'
const filtre = ref({
  adherent: '',
  livre: '',
  datePret: '',
  dateRetour: ''
})

const pretsFiltres = computed(() => {
  return prets.value.filter(pret => {
    const matchAdherent = filtre.value.adherent === '' || (`${pret.nom_adherent} ${pret.prenom_adherent}`.toLowerCase().includes(filtre.value.adherent.toLowerCase()));
    const matchLivre = filtre.value.livre === '' || pret.titre_livre?.toLowerCase().includes(filtre.value.livre.toLowerCase());
    const matchDatePret = filtre.value.datePret === '' || pret.date_pret?.slice(0,10) === filtre.value.datePret;
    const matchDateRetour = filtre.value.dateRetour === '' || pret.date_retour_prevue?.slice(0,10) === filtre.value.dateRetour;
    return matchAdherent && matchLivre && matchDatePret && matchDateRetour;
  });
});
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from "@/components/Navbar.vue"

const prets = ref([])
const adherents = ref([])
const livres = ref([])

const form = ref({
  id_adherent: '',
  id_livre: '',
  date_pret: '',
  date_retour_prevue: ''
})

onMounted(() => {
  chargerPrets()
  chargerAdherents()
  chargerLivres()
})

const chargerPrets = () => {
  axios.get('http://localhost:3000/api/prets/encours')
    .then(res => prets.value = res.data)
    .catch(() => alert("Erreur chargement prêts"))
}

const chargerAdherents = () => {
  axios.get('http://localhost:3000/api/adherents')
    .then(res => adherents.value = res.data)
    .catch(() => alert("Erreur chargement adhérents"))
}

const chargerLivres = () => {
  axios.get('http://localhost:3000/api/prets/livres-disponibles')
    .then(res => livres.value = res.data)
    .catch(() => alert("Erreur chargement livres"))
}

const ajouterPret = () => {
  // Contrôle des dates
  const datePret = new Date(form.value.date_pret);
  const dateRetour = new Date(form.value.date_retour_prevue);
  const today = new Date();
  today.setHours(0,0,0,0);

  if (isNaN(datePret.getTime()) || isNaN(dateRetour.getTime())) {
    alert("Veuillez saisir des dates valides.");
    return;
  }
  if (datePret > today) {
    alert("La date de prêt ne peut pas être dans le futur.");
    return;
  }
  if (dateRetour <= datePret) {
    alert("La date de retour prévue doit être après la date de prêt.");
    return;
  }

  axios.post('http://localhost:3000/api/prets', form.value)
    .then(() => {
      alert("📦 Prêt enregistré")
      chargerPrets()
      chargerLivres()
      resetForm()
    })
    .catch(err => alert("❌ Erreur ajout prêt : " + (err.response?.data?.error || '')))
}

const retournerLivre = (id) => {
  if (confirm("Confirmer le retour du livre ?")) {
    const today = new Date().toISOString().split('T')[0]
    axios.put(`http://localhost:3000/api/prets/retour/${id}`, { date_retour_effective: today })
      .then(() => {
        alert("✅ Livre retourné")
        chargerPrets()
        chargerLivres()
      })
      .catch(() => alert("Erreur retour"))
  }
}

const resetForm = () => {
  form.value = {
    id_adherent: '',
    id_livre: '',
    date_pret: '',
    date_retour_prevue: ''
  }
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR')
const isDatePassed = (dateString) => new Date(dateString) < new Date()
</script>

<style scoped>
/* Style avancé pour la barre de filtre */
.search-bar.advanced-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  background: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 12px 16px;
  flex-wrap: wrap;
}
.search-bar.advanced-filter .search-input {
  flex: 1 1 180px;
  min-width: 120px;
  max-width: 220px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d0d7de;
  background: #fff;
  font-size: 14px;
  margin: 0;
}
.search-bar.advanced-filter .search-input:focus {
  outline: none;
  border-color: #0969da;
  box-shadow: 0 0 0 2px rgba(9,105,218,0.08);
}
.main-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #24292f;
  padding: 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-card, .table-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #d0d7de;
}

.form-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 20px;
}

.form-label { font-weight: 500; color: #57606a; margin-bottom: 4px; }
.form-input { padding: 8px 12px; border-radius: 6px; border: 1px solid #d0d7de; background: #f6f8fa; }
.form-input:focus { outline: none; border-color: #0969da; box-shadow: 0 0 0 3px rgba(9,105,218,0.1); }

.form-actions { display: flex; gap: 8px; }
.btn { cursor: pointer; border: none; border-radius: 6px; padding: 8px 16px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; }
.btn-primary { background-color: #0969da; color: white; }
.btn-primary:hover { background-color: #0a5dc1; }

.table-responsive { overflow-x: auto; }
.book-table { width: 100%; border-collapse: collapse; }
.book-table th, .book-table td { padding: 12px 15px; border-bottom: 1px solid #d0d7de; text-align: left; }
.status-tag { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; display: inline-block; }
.status-tag.available { background-color: #e8f8ef; color: #1a7f37; }
.status-tag.unavailable { background-color: #ffebe9; color: #cf222e; }

.actions-cell { display: flex; gap: 8px; }
.action-btn { width: 32px; height: 32px; background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: background-color 0.2s; }
.return-btn:hover { background-color: #e8f8ef; }
.return-btn:hover .action-icon { color: #1a7f37; }
.action-icon { width: 16px; height: 16px; }
</style>
