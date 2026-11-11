<template>
  <div class="cours">
    <div class="header">
      <div>
        <h1>Gestion des cours 📚</h1>
        <p>Liste de tous les cours.</p>
      </div>

      <button @click="ouvrirFormulaire">
        + Ajouter un cours
      </button>
    </div>

    <div v-if="message" class="message">
      {{ message }}
    </div>

    <div v-if="afficherFormulaire" class="formulaire">
      <h2>{{ coursModifie ? 'Modifier le cours' : 'Ajouter un cours' }}</h2>

      <form @submit.prevent="enregistrer">
        <input
          v-model="form.nom"
          placeholder="Nom du cours"
          required
        />

        <input
          v-model="form.code"
          placeholder="Code du cours"
          required
        />

        <input
          v-model="form.description"
          placeholder="Description"
        />

        <input
          v-model.number="form.credits"
          type="number"
          min="1"
          max="30"
          placeholder="Nombre de crédits"
          required
        />

        <input
          v-model.number="form.professeurId"
          type="number"
          placeholder="ID du professeur"
          required
        />

        <input
          v-model.number="form.departementId"
          type="number"
          placeholder="ID du département"
          required
        />

        <button type="submit">Enregistrer</button>

        <button type="button" @click="fermerFormulaire">
          Annuler
        </button>
      </form>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Description</th>
            <th>Crédits</th>
            <th>Professeur</th>
            <th>Département</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="coursItem in cours" :key="coursItem.id">
            <td>{{ coursItem.nom }}</td>
            <td>{{ coursItem.code }}</td>
            <td>{{ coursItem.description }}</td>
            <td>{{ coursItem.credits }}</td>

            <td>
              {{ coursItem.professeur?.utilisateur?.nom || coursItem.professeurId }}
            </td>

            <td>
              {{ coursItem.departement?.nom || coursItem.departementId }}
            </td>

            <td>
              <button class="modifier" @click="modifier(coursItem)">
                Modifier
              </button>

              <button class="supprimer" @click="supprimer(coursItem.id)">
                Supprimer
              </button>
            </td>
          </tr>

          <tr v-if="cours.length === 0">
            <td colspan="7">Aucun cours trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api'

const cours = ref([])
const message = ref('')
const afficherFormulaire = ref(false)
const coursModifie = ref(null)

const form = ref({
  nom: '',
  code: '',
  description: '',
  credits: '',
  professeurId: '',
  departementId: ''
})

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

async function chargerCours() {
  try {
    const response = await fetch(`${API_URL}/cours`, {
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur de chargement')
    }

    cours.value = resultat.donnees || resultat
  } catch (error) {
    message.value = error.message
  }
}

function ouvrirFormulaire() {
  coursModifie.value = null

  form.value = {
    nom: '',
    code: '',
    description: '',
    credits: '',
    professeurId: '',
    departementId: ''
  }

  afficherFormulaire.value = true
  message.value = ''
}

function fermerFormulaire() {
  afficherFormulaire.value = false
  coursModifie.value = null
}

function modifier(coursItem) {
  coursModifie.value = coursItem.id

  form.value = {
    nom: coursItem.nom || '',
    code: coursItem.code || '',
    description: coursItem.description || '',
    credits: coursItem.credits || '',
    professeurId: coursItem.professeurId || '',
    departementId: coursItem.departementId || ''
  }

  afficherFormulaire.value = true
  message.value = ''
}

async function enregistrer() {
  try {
    const url = coursModifie.value
      ? `${API_URL}/cours/${coursModifie.value}`
      : `${API_URL}/cours`

    const response = await fetch(url, {
      method: coursModifie.value ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(form.value)
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur lors de l’enregistrement')
    }

    message.value = 'Cours enregistré avec succès.'
    fermerFormulaire()
    await chargerCours()
  } catch (error) {
    message.value = error.message
  }
}

async function supprimer(id) {
  if (!confirm('Voulez-vous vraiment supprimer ce cours ?')) {
    return
  }

  try {
    const response = await fetch(`${API_URL}/cours/${id}`, {
      method: 'DELETE',
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur lors de la suppression')
    }

    message.value = 'Cours supprimé avec succès.'
    await chargerCours()
  } catch (error) {
    message.value = error.message
  }
}

onMounted(() => {
  chargerCours()
})
</script>

<style scoped>
.cours {
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
  color: #192957;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

input {
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  min-width: 220px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f1f5f9;
  color: #192957;
}

th,
td {
  padding: 18px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.modifier {
  background: #f59e0b;
}

.supprimer {
  background: #dc3545;
}

.message {
  background: #e8f0ff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  color: #192957;
}
</style>