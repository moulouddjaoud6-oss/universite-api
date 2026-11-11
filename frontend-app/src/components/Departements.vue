```vue
<template>
  <div class="departements">
    <div class="header">
      <div>
        <h1>Gestion des départements 🏢</h1>
        <p>Liste de tous les départements.</p>
      </div>
      <button @click="ouvrirFormulaire">+ Ajouter un département</button>
    </div>

    <div v-if="message" class="message">{{ message }}</div>

    <div v-if="afficherFormulaire" class="formulaire">
      <h2>{{ departementModifie ? 'Modifier le département' : 'Ajouter un département' }}</h2>

      <form @submit.prevent="enregistrer">
        <input v-model="form.nom" placeholder="Nom du département" required />
        <input v-model="form.description" placeholder="Description" />

        <button type="submit">Enregistrer</button>
        <button type="button" @click="fermerFormulaire">Annuler</button>
      </form>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="dep in departements" :key="dep.id">
            <td>{{ dep.nom }}</td>
            <td>{{ dep.description || '-' }}</td>
            <td>
              <button @click="modifier(dep)">Modifier</button>
              <button class="supprimer" @click="supprimer(dep.id)">Supprimer</button>
            </td>
          </tr>

          <tr v-if="departements.length === 0">
            <td colspan="3">Aucun département trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:3000/api';

const departements = ref([]);
const message = ref('');
const afficherFormulaire = ref(false);
const departementModifie = ref(null);

const form = ref({
  nom: '',
  description: ''
});

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

async function chargerDepartements() {
  try {
    const response = await fetch(`${API_URL}/departements`, {
      headers: headers()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur de chargement');
    }

    departements.value = Array.isArray(result)
      ? result
      : result.donnees || [];
  } catch (error) {
    message.value = error.message;
  }
}

function ouvrirFormulaire() {
  departementModifie.value = null;
  form.value = { nom: '', description: '' };
  afficherFormulaire.value = true;
}

function fermerFormulaire() {
  afficherFormulaire.value = false;
  departementModifie.value = null;
}

function modifier(dep) {
  departementModifie.value = dep.id;
  form.value = {
    nom: dep.nom || '',
    description: dep.description || ''
  };
  afficherFormulaire.value = true;
}

async function enregistrer() {
  try {
    const id = departementModifie.value;

    const response = await fetch(
      id ? `${API_URL}/departements/${id}` : `${API_URL}/departements`,
      {
        method: id ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(form.value)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de l’enregistrement');
    }

    message.value = 'Département enregistré avec succès.';
    fermerFormulaire();
    await chargerDepartements();
  } catch (error) {
    message.value = error.message;
  }
}

async function supprimer(id) {
  if (!confirm('Voulez-vous vraiment supprimer ce département ?')) return;

  try {
    const response = await fetch(`${API_URL}/departements/${id}`, {
      method: 'DELETE',
      headers: headers()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la suppression');
    }

    message.value = 'Département supprimé avec succès.';
    await chargerDepartements();
  } catch (error) {
    message.value = error.message;
  }
}

onMounted(chargerDepartements);
</script>

<style scoped>
.departements {
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

input {
  padding: 12px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 7px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
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
```