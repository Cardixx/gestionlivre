<!-- src/components/AdminManagement.vue -->
<template>
  <div class="admin-container">
    <h1 class="admin-title">👤 Gestion des Administrateurs</h1>
    <!-- Le reste du template, script et style comme fourni dans la réponse précédente -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const admins = ref([]);
const currentAdmin = ref({ id_admin: null, username: '', password: '' });
const isEditing = ref(false);

async function fetchAdmins() {
  try {
    const response = await axios.get('/api/admins');
    admins.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des admins:', error);
  }
}

async function saveAdmin() {
  try {
    if (isEditing.value) {
      await axios.put(`/api/admins/${currentAdmin.value.id_admin}`, currentAdmin.value);
    } else {
      await axios.post('/api/admins', currentAdmin.value);
    }
    resetForm();
    fetchAdmins();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

async function deleteAdmin(id) {
  if (confirm('Voulez-vous vraiment supprimer cet administrateur ?')) {
    try {
      await axios.delete(`/api/admins/${id}`);
      fetchAdmins();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }
}

function editAdmin(admin) {
  currentAdmin.value = { ...admin };
  isEditing.value = true;
}

function resetForm() {
  currentAdmin.value = { id_admin: null, username: '', password: '' };
  isEditing.value = false;
}

fetchAdmins();
</script>