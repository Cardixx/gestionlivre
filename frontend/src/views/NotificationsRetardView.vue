<template>
  <div class="retard-notif">
    <h2>📢 Livres en retard</h2>
    <div v-if="retards.length === 0">Aucun livre en retard ✅</div>
    <ul v-else>
      <li v-for="pret in retards" :key="pret.id_pret">
        <strong>{{ pret.nom }} {{ pret.prenom }}</strong> doit retourner 
        <em>"{{ pret.titre }}"</em> (prévu le {{ formatDate(pret.date_retour_prevue) }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const retards = ref([])

const chargerRetards = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/prets/en-retard')
    retards.value = res.data.success ? res.data.data : []
  } catch (err) {
    console.error('Erreur chargement retards:', err)
  }
}

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

onMounted(chargerRetards)
</script>
