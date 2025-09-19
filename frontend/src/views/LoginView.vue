<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo ou icône institutionnelle -->
  <div class="logo">📚</div>
  <h2 class="title">Bibliothèque Indigo</h2>
    

      <form @submit.prevent="seConnecter">
        <input v-model="username" type="text" placeholder="Nom d’utilisateur" required />
        <input v-model="password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>

      <p v-if="erreur" class="error">{{ erreur }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const username = ref("");
const password = ref("");
const erreur = ref("");
const router = useRouter();

const seConnecter = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/admin", {
      username: username.value,
      password: password.value
    });

    // ✅ Stockage du token et rôle
    localStorage.setItem("authToken", res.data.token);
    localStorage.setItem("userRole", res.data.role);

    // ✅ Redirection
    router.push("/accueil");
  } catch (err) {
    erreur.value = err.response?.data?.error || "Erreur de connexion";
  }
};
</script>

<style scoped>
/* 🌐 Contexte institutionnel : couleurs sobres et sérieuses */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #1e3c72, #2a5298);
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
}

.login-card {
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  width: 360px;
  text-align: center;
}

.logo {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #1e3c72;
}

.title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #1e3c72;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 20px;
}

.login-card input {
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-card input:focus {
  border-color: #2a5298;
  box-shadow: 0 0 5px rgba(42, 82, 152, 0.3);
  outline: none;
}

.login-card button {
  width: 100%;
  padding: 12px;
  background: #2a5298;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.login-card button:hover {
  background: #1e3c72;
}

.error {
  margin-top: 12px;
  color: red;
  font-size: 0.9rem;
}
</style>
