```vue
<template>
  <div class="inscriptions-page">
    <div class="page-header">
      <div>
        <h1>Gestion des inscriptions 📝</h1>
        <p>Liste de toutes les inscriptions.</p>
      </div>

      <button class="btn-primary" @click="ouvrirFormulaire">
        + Ajouter une inscription
      </button>
    </div>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>

    <!-- FORMULAIRE -->
    <div v-if="afficherFormulaire" class="form-card">
      <h2>{{ inscriptionModifiee ? 'Modifier l’inscription' : 'Ajouter une inscription' }}</h2>

      <form @submit.prevent="enregistrer">
        <div class="form-grid">
          <input
            v-model="form.dateInscription"
            type="date"
            required
          />

          <select v-model="form.statut" required>
            <option value="active">Active</option>
            <option value="annulee">Annulée</option>
            <option value="terminee">Terminée</option>
          </select>

          <input
            v-model.number="form.etudiantId"
            type="number"
            min="1"
            placeholder="ID de l'étudiant"
            required
          />

          <input
            v-model.number="form.coursId"
            type="number"
            min="1"
            placeholder="ID du cours"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            Enregistrer
          </button>

          <button
            type="button"
            class="btn-cancel"
            @click="fermerFormulaire"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>

    <!-- TABLEAU -->
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date d'inscription</th>
            <th>Étudiant</th>
            <th>Cours</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="inscription in inscriptions" :key="inscription.id">
            <td>{{ inscription.id }}</td>
            <td>{{ inscription.dateInscription }}</td>
            <td>
              {{ inscription.etudiant?.matricule || inscription.etudiantId }}
            </td>
            <td>
              {{ inscription.cours?.nom || inscription.coursId }}
            </td>
            <td>{{ inscription.statut }}</td>

            <td>
              <button
                class="btn-edit"
                @click="modifier(inscription)"
              >
                Modifier
              </button>

              <button
                class="btn-delete"
                @click="supprimer(inscription.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>

          <tr v-if="inscriptions.length === 0">
            <td colspan="6">Aucune inscription trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api'

const inscriptions = ref([])
const afficherFormulaire = ref(false)
const inscriptionModifiee = ref(null)
const message = ref('')
const erreur = ref('')

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

function dateAujourdhui() {
  return new Date().toISOString().slice(0, 10)
}

const form = ref({
  dateInscription: dateAujourdhui(),
  statut: 'active',
  etudiantId: '',
  coursId: ''
})

async function chargerInscriptions() {
  try {
    erreur.value = ''

    const response = await fetch(`${API_URL}/inscriptions`, {
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur de chargement')
    }

    inscriptions.value = Array.isArray(resultat)
      ? resultat
      : resultat.donnees || []
  } catch (error) {
    erreur.value = error.message
  }
}

function ouvrirFormulaire() {
  inscriptionModifiee.value = null

  form.value = {
    dateInscription: dateAujourdhui(),
    statut: 'active',
    etudiantId: '',
    coursId: ''
  }

  message.value = ''
  erreur.value = ''
  afficherFormulaire.value = true
}

function fermerFormulaire() {
  afficherFormulaire.value = false
  inscriptionModifiee.value = null
}

function modifier(inscription) {
  inscriptionModifiee.value = inscription.id

  form.value = {
    dateInscription: inscription.dateInscription,
    statut: inscription.statut,
    etudiantId: inscription.etudiantId,
    coursId: inscription.coursId
  }

  message.value = ''
  erreur.value = ''
  afficherFormulaire.value = true
}

async function enregistrer() {
  try {
    erreur.value = ''
    message.value = ''

    const url = inscriptionModifiee.value
      ? `${API_URL}/inscriptions/${inscriptionModifiee.value}`
      : `${API_URL}/inscriptions`

    const response = await fetch(url, {
      method: inscriptionModifiee.value ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(form.value)
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur lors de l’enregistrement')
    }

    message.value = inscriptionModifiee.value
      ? 'Inscription modifiée avec succès.'
      : 'Inscription enregistrée avec succès.'

    fermerFormulaire()
    await chargerInscriptions()
  } catch (error) {
    erreur.value = error.message
  }
}

async function supprimer(id) {
  if (!confirm('Voulez-vous vraiment supprimer cette inscription ?')) {
    return
  }

  try {
    erreur.value = ''
    message.value = ''

    const response = await fetch(`${API_URL}/inscriptions/${id}`, {
      method: 'DELETE',
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur lors de la suppression')
    }

    message.value = 'Inscription supprimée avec succès.'
    await chargerInscriptions()
  } catch (error) {
    erreur.value = error.message
  }
}

onMounted(chargerInscriptions)
</script>

<style scoped>
.inscriptions-page {
  padding: 30px;
  color: #192957;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  gap: 20px;
}

h1 {
  font-size: 34px;
  margin-bottom: 10px;
}

.page-header p {
  color: #71809b;
  font-size: 18px;
}

.form-card,
.table-card {
  background: white;
  padding: 25px;
  border-radius: 18px;
  margin-bottom: 25px;
}

.form-card h2 {
  text-align: center;
  margin-bottom: 25px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

input,
select {
  padding: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

button {
  border: none;
  padding: 12px 20px;
  border-radius: 9px;
  cursor: pointer;
  color: white;
}

.btn-primary {
  background: #2860ed;
}

.btn-cancel {
  background: #64748b;
}

.btn-edit {
  background: #f59e0b;
  margin: 3px;
}

.btn-delete {
  background: #e52e42;
  margin: 3px;
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
  padding: 17px 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

td {
  color: #64748b;
}

.message {
  background: #e5efff;
  padding: 15px;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 10px;
}

.erreur {
  color: red;
  text-align: center;
  margin: 15px;
}

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-card {
    overflow-x: auto;
  }
}
</style>
```