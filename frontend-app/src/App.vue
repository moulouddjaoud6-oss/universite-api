```vue
<script setup>
import { ref } from 'vue'
import Etudiants from './components/Etudiants.vue'
import Professeurs from './components/Professeurs.vue'
import Departements from './components/Departements.vue'
import Cours from './components/Cours.vue'
import Inscriptions from './components/Inscriptions.vue'
import Notes from './components/Notes.vue'
import Utilisateurs from './components/Utilisateurs.vue'

const API_URL = 'http://localhost:3000/api'

const email = ref('')
const motDePasse = ref('')
const erreur = ref('')
const chargement = ref(false)

const token = ref(localStorage.getItem('token') || '')

const utilisateur = ref(
  JSON.parse(localStorage.getItem('utilisateur') || 'null')
)

const activePage = ref('Tableau de bord')

const menuItems = [
  { name: 'Tableau de bord', icon: '📊' },
  { name: 'Étudiants', icon: '🎓' },
  { name: 'Professeurs', icon: '👨‍🏫' },
  { name: 'Départements', icon: '🏢' },
  { name: 'Cours', icon: '📚' },
  { name: 'Inscriptions', icon: '📝' },
  { name: 'Notes', icon: '📋' },
  { name: 'Utilisateurs', icon: '👥' }
]

const connexion = async () => {
  erreur.value = ''
  chargement.value = true

  try {
    const response = await fetch(`${API_URL}/auth/connexion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        motDePasse: motDePasse.value
      })
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Identifiants incorrects.')
    }

    token.value = resultat.token
    utilisateur.value = resultat.utilisateur

    localStorage.setItem('token', resultat.token)
    localStorage.setItem(
      'utilisateur',
      JSON.stringify(resultat.utilisateur)
    )

  } catch (error) {
    erreur.value = error.message || 'Impossible de contacter le serveur.'
  } finally {
    chargement.value = false
  }
}

const deconnexion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('utilisateur')

  token.value = ''
  utilisateur.value = null

  email.value = ''
  motDePasse.value = ''
  activePage.value = 'Tableau de bord'
}
</script>

<template>

  <!-- PAGE DE CONNEXION -->
  <div v-if="!token" class="login-page">

    <div class="login-box">

      <div class="login-logo">🎓</div>

      <h1>UniGestion</h1>

      <p class="subtitle">Administration universitaire</p>

      <form @submit.prevent="connexion">

        <label>Adresse e-mail</label>

        <input
          v-model="email"
          type="email"
          placeholder="admin@universite.local"
          required
        />

        <label>Mot de passe</label>

        <input
          v-model="motDePasse"
          type="password"
          placeholder="Votre mot de passe"
          required
        />

        <p v-if="erreur" class="error">{{ erreur }}</p>

        <button type="submit" :disabled="chargement">
          {{ chargement ? 'Connexion en cours...' : 'Se connecter' }}
        </button>

      </form>

      <p class="footer-login">
        © 2026 UniGestion
      </p>

    </div>

  </div>

  <!-- TABLEAU DE BORD -->
  <div v-else class="dashboard">

    <aside class="sidebar">

      <div class="logo">🎓 UniGestion</div>

      <p class="menu-title">MENU PRINCIPAL</p>

      <nav>
        <button
          v-for="item in menuItems"
          :key="item.name"
          @click="activePage = item.name"
          :class="{ active: activePage === item.name }"
        >
          {{ item.icon }} {{ item.name }}
        </button>
      </nav>

    </aside>

    <main class="main-content">

      <header class="topbar">

        <h2>{{ activePage }}</h2>

        <div class="profile">
          {{ utilisateur?.prenom }} {{ utilisateur?.nom }}

          <div class="avatar">
            {{ utilisateur?.nom?.charAt(0) || 'A' }}
          </div>

          <button class="logout" @click="deconnexion">
            Déconnexion
          </button>
        </div>

      </header>

      <!-- PAGE ETUDIANTS -->
      <Etudiants
        v-if="activePage === 'Étudiants'"
      />

      <!-- PAGE PROFESSEURS -->
<Professeurs
  v-else-if="activePage === 'Professeurs'"
/>

<!-- PAGE DEPARTEMENTS -->
<Departements
  v-else-if="activePage === 'Départements'"
/>
<Cours
  v-else-if="activePage === 'Cours'"
/>
<!-- PAGE INSCRIPTIONS -->
<Inscriptions
  v-else-if="activePage === 'Inscriptions'"
/>
<Notes v-else-if="activePage === 'Notes'" />
<!-- PAGE UTILISATEURS -->
<Utilisateurs
  v-else-if="activePage === 'Utilisateurs'"
/>

      <!-- AUTRES PAGES -->
      <section v-else class="content">

        <h1>Bienvenue sur UniGestion 👋</h1>

        <p>Votre système de gestion universitaire.</p>

        <div class="cards">

          <div class="card">
            🎓
            <h2>250</h2>
            Étudiants
          </div>

          <div class="card">
            👨‍🏫
            <h2>35</h2>
            Professeurs
          </div>

          <div class="card">
            📚
            <h2>48</h2>
            Cours
          </div>

          <div class="card">
            🏢
            <h2>8</h2>
            Départements
          </div>

        </div>

      </section>

    </main>

  </div>

</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f4f6fb;
}

/* PAGE DE CONNEXION */

.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #172554, #2563eb);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px;
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.login-logo {
  font-size: 55px;
  text-align: center;
  margin-bottom: 15px;
}

.login-box h1 {
  text-align: center;
  color: #172554;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 30px;
}

.login-box label {
  display: block;
  margin-bottom: 8px;
  color: #172554;
  font-weight: bold;
}

.login-box input {
  width: 100%;
  padding: 13px;
  margin-bottom: 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
}

.login-box input:focus {
  outline: 2px solid #2563eb;
}

.login-box form button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.login-box form button:hover {
  background: #1d4ed8;
}

.login-box form button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error {
  color: #dc2626;
  margin-bottom: 15px;
  font-size: 14px;
}

.footer-login {
  text-align: center;
  color: #94a3b8;
  margin-top: 25px;
  font-size: 13px;
}

/* TABLEAU DE BORD */

.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #172554;
  color: white;
  padding: 25px 15px;
}

.logo {
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 45px;
}

.menu-title {
  color: #94a3b8;
  margin-bottom: 15px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

nav button {
  border: none;
  background: transparent;
  color: #cbd5e1;
  padding: 14px;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
}

nav button:hover,
nav button.active {
  background: #2563eb;
  color: white;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.topbar {
  min-height: 75px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 35px;
  gap: 15px;
}

.topbar h2 {
  color: #172554;
}

.profile {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.logout {
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 7px;
  cursor: pointer;
}

.content {
  padding: 35px;
}

.content h1 {
  color: #172554;
  margin-bottom: 10px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  color: #172554;
  font-size: 20px;
}

.card h2 {
  margin: 15px 0;
}

@media(max-width: 700px) {
  .sidebar {
    width: 180px;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-wrap: wrap;
    padding: 15px;
  }

  .profile {
    flex-wrap: wrap;
  }
}
</style>
```