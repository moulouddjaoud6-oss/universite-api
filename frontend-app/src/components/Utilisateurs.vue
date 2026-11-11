<template>
  <div class="utilisateurs">
    <div class="header">
      <div>
        <h1>Gestion des utilisateurs 👥</h1>
        <p>Liste de tous les utilisateurs.</p>
      </div>

      <button @click="ouvrirFormulaire">
        + Ajouter un utilisateur
      </button>
    </div>

    <div v-if="message" class="message">
      {{ message }}
    </div>

    <div v-if="afficherFormulaire" class="formulaire">
      <h2>{{ utilisateurModifie ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur' }}</h2>

      <form @submit.prevent="enregistrer">
        <input v-model="form.nom" placeholder="Nom" required />

        <input v-model="form.prenom" placeholder="Prénom" required />

        <input v-model="form.email" type="email" placeholder="Email" required />

        <input
          v-model="form.motDePasse"
          type="password"
          :placeholder="utilisateurModifie ? 'Nouveau mot de passe (facultatif)' : 'Mot de passe'"
          :required="!utilisateurModifie"
        />

        <select v-model="form.roleId" required>
          <option value="">Choisir un rôle</option>
          <option
            v-for="role in roles"
            :key="role.id"
            :value="role.id"
          >
            {{ role.nom }}
          </option>
        </select>

        <button type="submit">Enregistrer</button>
        <button type="button" @click="fermerFormulaire">Annuler</button>
      </form>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in utilisateurs" :key="user.id">
            <td>{{ user.nom }}</td>
            <td>{{ user.prenom }}</td>
            <td>{{ user.email }}</td>
            <td>{{ nomRole(user.roleId) }}</td>
            <td>
              <button @click="modifier(user)">Modifier</button>
              <button class="supprimer" @click="supprimer(user.id)">
                Supprimer
              </button>
            </td>
          </tr>

          <tr v-if="utilisateurs.length === 0">
            <td colspan="5">Aucun utilisateur trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3000/api';

const utilisateurs = ref([]);
const roles = ref([]);
const message = ref('');
const afficherFormulaire = ref(false);
const utilisateurModifie = ref(null);

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  roleId: ''
});

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };
}

async function chargerUtilisateurs() {
  try {
    const response = await fetch(`${API_URL}/utilisateurs`, {
      headers: headers()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur de chargement des utilisateurs');
    }

    utilisateurs.value = Array.isArray(result)
      ? result
      : result.donnees || [];
  } catch (error) {
    message.value = error.message;
  }
}

async function chargerRoles() {
  try {
    const response = await fetch(`${API_URL}/roles`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error('Impossible de charger les rôles');
    }

    roles.value = Array.isArray(result)
      ? result
      : result.donnees || [];
  } catch (error) {
    message.value = error.message;
  }
}

function nomRole(roleId) {
  const role = roles.value.find(r => Number(r.id) === Number(roleId));
  return role ? role.nom : roleId;
}

function ouvrirFormulaire() {
  utilisateurModifie.value = null;

  form.value = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    roleId: ''
  };

  afficherFormulaire.value = true;
}

function fermerFormulaire() {
  afficherFormulaire.value = false;
  utilisateurModifie.value = null;
}

function modifier(user) {
  utilisateurModifie.value = user.id;

  form.value = {
    nom: user.nom || '',
    prenom: user.prenom || '',
    email: user.email || '',
    motDePasse: '',
    roleId: user.roleId || ''
  };

  afficherFormulaire.value = true;
}

async function enregistrer() {
  try {
    const id = utilisateurModifie.value;

    const donnees = { ...form.value };

    if (id && !donnees.motDePasse) {
      delete donnees.motDePasse;
    }

    const response = await fetch(
      id
        ? `${API_URL}/utilisateurs/${id}`
        : `${API_URL}/utilisateurs`,
      {
        method: id ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(donnees)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de l’enregistrement');
    }

    message.value = 'Utilisateur enregistré avec succès.';

    fermerFormulaire();

    await chargerUtilisateurs();
  } catch (error) {
    message.value = error.message;
  }
}

async function supprimer(id) {
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/utilisateurs/${id}`, {
      method: 'DELETE',
      headers: headers()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la suppression');
    }

    message.value = 'Utilisateur supprimé avec succès.';

    await chargerUtilisateurs();
  } catch (error) {
    message.value = error.message;
  }
}

onMounted(() => {
  chargerRoles();
  chargerUtilisateurs();
});
</script>

<style scoped>
.utilisateurs {
  padding: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #192957;
  font-size: 38px;
}

.header p {
  color: #64748b;
  font-size: 18px;
}

button {
  background: #2860e8;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin: 4px;
}

.formulaire,
.table-container {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
}

.formulaire h2 {
  text-align: center;
}

input,
select {
  padding: 12px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 7px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background: #f5f7fb;
  color: #192957;
}

.supprimer {
  background: #dc3545;
}

.message {
  padding: 12px;
  margin-bottom: 15px;
  background: #e8f0ff;
  border-radius: 8px;
}
</style>