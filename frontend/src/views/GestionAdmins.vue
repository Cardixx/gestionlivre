<template>
  <div class="container">
    <h2>👤 Gestion des Admins</h2>

    <!-- Formulaire d'ajout / édition -->
    <form @submit.prevent="editerId ? modifierAdmin() : ajouterAdmin()" class="admin-form">
      <input v-model="form.username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="form.password" type="password" placeholder="Mot de passe" required />

      <button type="submit">
        {{ editerId ? 'Modifier' : 'Ajouter' }}
      </button>
      <button v-if="editerId" type="button" @click="annulerEdition" class="cancel-btn">
        Annuler
      </button>
    </form>

    <!-- Liste des admins -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom d'utilisateur</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id_admin">
          <td>{{ admin.id_admin }}</td>
          <td>{{ admin.username }}</td>
          <td>
            <button @click="chargerAdmin(admin)">✏️ Modifier</button>
            <button @click="supprimerAdmin(admin.id_admin)" class="delete-btn">🗑️ Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const admins = ref([]);
const editerId = ref(null);
const form = ref({
  username: "",
  password: ""
});

// 📥 Charger tous les admins
const chargerAdmins = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/admin");
    admins.value = res.data;
  } catch (err) {
    console.error("Erreur chargement admins:", err);
  }
};

// ➕ Ajouter un admin
const ajouterAdmin = async () => {
  try {
    await axios.post("http://localhost:3000/api/admin", form.value);
    chargerAdmins();
    form.value = { username: "", password: "" };
  } catch (err) {
    console.error("Erreur ajout admin:", err);
  }
};

// ✏️ Préparer la modification
const chargerAdmin = (admin) => {
  editerId.value = admin.id_admin;
  form.value = { username: admin.username, password: "" };
};

// ✏️ Modifier un admin
const modifierAdmin = async () => {
  try {
    await axios.put(`http://localhost:3000/api/admin/${editerId.value}`, form.value);
    chargerAdmins();
    annulerEdition();
  } catch (err) {
    console.error("Erreur modification admin:", err);
  }
};

// ❌ Annuler édition
const annulerEdition = () => {
  editerId.value = null;
  form.value = { username: "", password: "" };
};

// 🗑️ Supprimer un admin
const supprimerAdmin = async (id) => {
  if (confirm("Voulez-vous vraiment supprimer cet admin ?")) {
    try {
      await axios.delete(`http://localhost:3000/api/admin/${id}`);
      chargerAdmins();
    } catch (err) {
      console.error("Erreur suppression admin:", err);
    }
  }
};

onMounted(() => {
  chargerAdmins();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #24292f;
}

.admin-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.admin-form input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.admin-form button {
  padding: 8px 12px;
  border: none;
  background: #0969da;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background: #999;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.delete-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}
</style>
