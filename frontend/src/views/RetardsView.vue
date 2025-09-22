<template>
  <div class="app-container">
    <!-- Navbar -->
    <Navbar />

    <!-- Conteneur principal -->
    <div class="dashboard-container">
      <!-- En-tête -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="title-section">
            <div class="title-with-icon">
              <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
                <path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
              </svg>
              <h1>Livres en retard</h1>
            </div>
            <p class="subtitle">Gestion des retours de livres non restitués à temps</p>
          </div>
          
          <div class="stats-section">
            <div class="stat-card">
              <span class="stat-number">{{ retards.length }}</span>
              <span class="stat-label">Livre(s) en retard</span>
            </div>
          </div>
        </div>
        
        <div class="header-actions">
          <div class="action-group">
            
            
          </div>
          <div class="last-update">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14" class="update-icon">
              <path fill="currentColor" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm0 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Z"></path>
            </svg>
            Dernière mise à jour : {{ formatDate(new Date()) }}
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="dashboard-content">
        <div v-if="retards.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="48" height="48">
              <path fill="#dbdbdb" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
              <path fill="#dbdbdb" d="M8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
            </svg>
          </div>
          <h3>Aucun livre en retard</h3>
          <p>Tous les livres ont été retournés à temps.</p>
        </div>

        <div v-else class="table-wrapper">
          <!-- Barre de filtre avancé -->
          <div class="search-bar advanced-filter">
            <input v-model="filtre.livre" type="text" class="search-input" placeholder="Livre" />
            <input v-model="filtre.adherent" type="text" class="search-input" placeholder="Adhérent" />
            <input v-model="filtre.datePret" type="date" class="search-input" placeholder="Date prêt" />
            <input v-model="filtre.dateRetour" type="date" class="search-input" placeholder="Retour prévu" />
            <input v-model="filtre.retard" type="number" class="search-input" placeholder="Jours de retard" min="0" />
          </div>
          <table class="modern-table">
            <thead>
              <tr>
                <th class="text-center">#</th>
                <th>Livre</th>
                <th>Adhérent</th>
                <th>Contact</th>
                <th>Date de prêt</th>
                <th>Retour prévu</th>
                <th class="text-center">Retard</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(retard, index) in retardsFiltres" :key="retard.id_pret" class="table-row">
import { computed, ref } from 'vue'
const filtre = ref({
  livre: '',
  adherent: '',
  datePret: '',
  dateRetour: '',
  retard: ''
})

function getDaysLate(dateRetourPrevue) {
  const today = new Date();
  const retour = new Date(dateRetourPrevue);
  const diff = Math.floor((today - retour) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const retardsFiltres = computed(() => {
  return retards.filter(retard => {
    const matchLivre = filtre.value.livre === '' || retard.titre?.toLowerCase().includes(filtre.value.livre.toLowerCase());
    const matchAdherent = filtre.value.adherent === '' || (`${retard.prenom} ${retard.nom}`.toLowerCase().includes(filtre.value.adherent.toLowerCase()));
    const matchDatePret = filtre.value.datePret === '' || retard.date_pret?.slice(0,10) === filtre.value.datePret;
    const matchDateRetour = filtre.value.dateRetour === '' || retard.date_retour_prevue?.slice(0,10) === filtre.value.dateRetour;
    const matchRetard = filtre.value.retard === '' || getDaysLate(retard.date_retour_prevue) === Number(filtre.value.retard);
    return matchLivre && matchAdherent && matchDatePret && matchDateRetour && matchRetard;
  });
});
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  <div class="book-info">
                    <div class="book-title">{{ retard.titre }}</div>
                    <div class="book-author">{{ retard.auteur }}</div>
                  </div>
                </td>
                <td>
                  <div class="user-info">
                    <div class="user-name">{{ retard.prenom }} {{ retard.nom }}</div>
                    <div class="user-id">ID: {{ retard.id_adherent }}</div>
                  </div>
                </td>
                <td>
                  <div class="contact-info">
                    <a :href="'tel:' + retard.telephone" class="contact-link">
                      <svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14">
                        <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z"></path>
                      </svg>
                      {{ formatPhoneNumber(retard.telephone) }}
                    </a>
                    <a :href="'mailto:' + retard.email" class="contact-link">
                      <svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="14" height="14">
                        <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path>
                      </svg>
                      {{ retard.email }}
                    </a>
                  </div>
                </td>
                <td>
                  <div class="date-value">{{ formatDate(retard.date_pret) }}</div>
                </td>
                <td>
                  <div class="date-value">{{ formatDate(retard.date_retour_prevue) }}</div>
                </td>
                <td class="text-center">
                  <div class="retard-indicator">
                    <span class="retard-badge" :class="getRetardSeverityClass(retard.date_retour_prevue)">
                      {{ calculateDaysLate(retard.date_retour_prevue) }} jours
                    </span>
                    <div class="severity-meter">
                      <div class="severity-fill" :style="{width: getSeverityWidth(retard.date_retour_prevue)}"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal PDF -->
      <div v-if="showPdfModal" class="modal-overlay" @click.self="showPdfModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Options d'export PDF</h3>
            <button class="modal-close" @click="showPdfModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.72a.75.75 0 0 1 0-1.06Z"></path>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Titre du document</label>
              <input v-model="pdfOptions.title" type="text" class="form-input">
            </div>
            <div class="form-group">
              <label>Sous-titre</label>
              <input v-model="pdfOptions.subtitle" type="text" class="form-input">
            </div>
            <div class="form-group">
              <label>Orientation</label>
              <select v-model="pdfOptions.orientation" class="form-input">
                <option value="portrait">Portrait</option>
                <option value="landscape">Paysage</option>
              </select>
            </div>
            <div class="form-checkbox-group">
              <label class="checkbox-label">
                <input v-model="pdfOptions.includeContacts" type="checkbox" class="checkbox-input">
                <span class="checkmark"></span>
                Inclure les contacts
              </label>
            </div>
            <div class="form-checkbox-group">
              <label class="checkbox-label">
                <input v-model="pdfOptions.includeStats" type="checkbox" class="checkbox-input">
                <span class="checkmark"></span>
                Inclure un résumé statistique
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showPdfModal = false" class="btn btn-outline">Annuler</button>
            <button @click="generateCustomPdf" class="btn btn-primary">Générer PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from "@/components/Navbar.vue"

export default {
  name: 'RetardsView',
  components: { Navbar },
  data() {
    return {
      retards: [],
      showPdfModal: false,
      pdfOptions: {
        title: 'Liste des livres en retard',
        subtitle: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
        orientation: 'landscape',
        includeContacts: true,
        includeStats: true
      }
    }
  },
  methods: {
    async fetchRetards() {
      try {
        const res = await axios.get('http://localhost:3000/api/retards')
        this.retards = res.data.data
      } catch (err) {
        console.error('Erreur chargement retards', err)
      }
    },
    async envoyerRappels() {
      try {
        const response = await axios.post('http://localhost:3000/api/retards/rappel', { retards: this.retards })
        alert(`${response.data.success} rappels envoyés avec succès`)
      } catch (err) {
        console.error("Erreur lors de l'envoi des rappels", err)
        alert("Erreur lors de l'envoi des rappels")
      }
    },
    generateCustomPdf() {
      this.showPdfModal = false;
      const params = { ...this.pdfOptions, subtitle: this.pdfOptions.subtitle || `Généré le ${this.formatDate(new Date())}` };
      const queryString = new URLSearchParams(params).toString();
      window.open(`http://localhost:3000/api/retards/pdf?${queryString}`, '_blank');
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR')
    },
    calculateDaysLate(returnDate) {
      const retour = new Date(returnDate)
      const aujourdhui = new Date()
      const diffTime = aujourdhui - retour
      return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))
    },
    formatPhoneNumber(phone) {
      return phone.replace(/(\d{2})(?=\d)/g, '$1 ')
    },
    getRetardSeverityClass(returnDate) {
      const daysLate = this.calculateDaysLate(returnDate);
      if (daysLate > 14) return 'retard-critical';
      if (daysLate > 7) return 'retard-severe';
      if (daysLate > 3) return 'retard-moderate';
      return 'retard-minor';
    },
    getSeverityWidth(returnDate) {
      const daysLate = this.calculateDaysLate(returnDate);
      return `${Math.min(100, daysLate * 5)}%`;
    }
  },
  mounted() {
    this.fetchRetards()
  }
}
</script>

<style scoped>
/* Styles généraux */
.app-container {
  min-height: 100vh;
  background-color: #f7f9fc;
}

.dashboard-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

/* En-tête */
.dashboard-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-icon {
  color: #6366f1;
}

.title-with-icon h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.stats-section {
  display: flex;
}

.stat-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  min-width: 100px;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #6366f1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-group {
  display: flex;
  gap: 12px;
}

.last-update {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.update-icon {
  color: #9ca3af;
}

/* Boutons */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-icon {
  background: #6366f1;
  color: white;
}

.btn-icon:hover {
  background: #4f46e5;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-outline {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.btn-outline:hover {
  background: #f9fafb;
}

/* Contenu */
.dashboard-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.text-center {
  text-align: center;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.modern-table td {
  padding: 16px;
  vertical-align: top;
}

/* Informations livre */
.book-info {
  max-width: 250px;
}

.book-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.book-author {
  font-size: 13px;
  color: #6b7280;
}

/* Informations utilisateur */
.user-info {
  max-width: 180px;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.user-id {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

/* Contact */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: #6366f1;
}

.contact-icon {
  color: #9ca3af;
}

/* Dates */
.date-value {
  font-size: 14px;
  color: #4b5563;
}

/* Indicateur de retard */
.retard-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.retard-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.retard-minor {
  background: #fef3c7;
  color: #92400e;
}

.retard-moderate {
  background: #fed7aa;
  color: #ea580c;
}

.retard-severe {
  background: #fecaca;
  color: #dc2626;
}

.retard-critical {
  background: #fca5a5;
  color: #991b1b;
}

.severity-meter {
  width: 60px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.severity-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.retard-minor + .severity-meter .severity-fill {
  background: #f59e0b;
}

.retard-moderate + .severity-meter .severity-fill {
  background: #f97316;
}

.retard-severe + .severity-meter .severity-fill {
  background: #ef4444;
}

.retard-critical + .severity-meter .severity-fill {
  background: #b91c1c;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

/* Formulaires */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-checkbox-group {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-input:checked ~ .checkmark {
  background-color: #6366f1;
  border-color: #6366f1;
}

.checkmark:after {
  content: "";
  display: none;
}

.checkbox-input:checked ~ .checkmark:after {
  display: block;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-top: -2px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .action-group {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    justify-content: center;
  }
  
  .modern-table {
    min-width: 700px;
  }
}
</style>