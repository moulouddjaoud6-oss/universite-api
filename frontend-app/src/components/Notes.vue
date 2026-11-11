```vue
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api'

const notes = ref([])
const inscriptions = ref([])
const afficherFormulaire = ref(false)
const noteModifiee = ref(null)
const message = ref('')
const erreur = ref('')

const form = ref({
  inscriptionId: '',
  valeur: '',
  commentaire: ''
})

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

// Charger les notes
async function chargerNotes() {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur de chargement des notes.')
    }

    notes.value = Array.isArray(resultat)
      ? resultat
      : resultat.donnees || []

  } catch (error) {
    erreur.value = error.message
  }
}

// Charger les inscriptions
async function chargerInscriptions() {
  try {
    const response = await fetch(`${API_URL}/inscriptions`, {
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur de chargement des inscriptions.')
    }

    inscriptions.value = Array.isArray(resultat)
      ? resultat
      : resultat.donnees || []

  } catch (error) {
    erreur.value = error.message
  }
}

// Ouvrir le formulaire
function ouvrirFormulaire() {
  noteModifiee.value = null

  form.value = {
    inscriptionId: '',
    valeur: '',
    commentaire: ''
  }

  message.value = ''
  erreur.value = ''
  afficherFormulaire.value = true
}

// Modifier une note
function modifier(noteItem) {
  noteModifiee.value = noteItem.id

  form.value = {
    inscriptionId: noteItem.inscriptionId,
    valeur: noteItem.note,
    commentaire: noteItem.appreciation || ''
  }

  message.value = ''
  erreur.value = ''
  afficherFormulaire.value = true
}

// Fermer le formulaire
function fermerFormulaire() {
  afficherFormulaire.value = false
  noteModifiee.value = null
}

// Enregistrer une note
async function enregistrer() {
  message.value = ''
  erreur.value = ''

  try {
    const url = noteModifiee.value
      ? `${API_URL}/notes/${noteModifiee.value}`
      : `${API_URL}/notes`

    const response = await fetch(url, {
      method: noteModifiee.value ? 'PUT' : 'POST',
      headers: headers(),

      body: JSON.stringify({
        inscriptionId: Number(form.value.inscriptionId),
        note: Number(form.value.valeur),
        appreciation: form.value.commentaire
      })
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur lors de l’enregistrement.')
    }

    message.value = 'Note enregistrée avec succès.'

    fermerFormulaire()

    await chargerNotes()

  } catch (error) {
    erreur.value = error.message || 'Erreur lors de l’enregistrement.'
  }
}

// Supprimer une note
async function supprimer(id) {
  if (!confirm('Voulez-vous vraiment supprimer cette note ?')) {
    return
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: headers()
    })

    const resultat = await response.json()

    if (!response.ok) {
      throw new Error(resultat.message || 'Erreur de suppression.')
    }

    message.value = 'Note supprimée avec succès.'

    await chargerNotes()

  } catch (error) {
    erreur.value = error.message || 'Erreur de suppression.'
  }
}

// Initialisation
onMounted(async () => {
  await chargerInscriptions()
  await chargerNotes()
})
</script>

<template>
  <section class="notes-page">

    <!-- EN-TETE -->
    <div class="page-header">

      <div>
        <h1>Gestion des notes 📋</h1>
        <p>Liste de toutes les notes des étudiants.</p>
      </div>

      <button class="btn-primary" @click="ouvrirFormulaire">
        + Ajouter une note
      </button>

    </div>

    <!-- MESSAGES -->
    <p v-if="message" class="message">
      {{ message }}
    </p>

    <p v-if="erreur" class="error">
      {{ erreur }}
    </p>

    <!-- FORMULAIRE -->
    <div v-if="afficherFormulaire" class="form-card">

      <h2>
        {{ noteModifiee ? 'Modifier la note' : 'Ajouter une note' }}
      </h2>

      <form @submit.prevent="enregistrer">

        <select v-model="form.inscriptionId" required>
          <option value="" disabled>
            Choisir une inscription
          </option>

          <option
            v-for="inscription in inscriptions"
            :key="inscription.id"
            :value="inscription.id"
          >
            Inscription #{{ inscription.id }}
            - {{ inscription.etudiant?.matricule || 'Étudiant' }}
            - {{ inscription.cours?.nom || 'Cours' }}
          </option>
        </select>

        <input
          v-model="form.valeur"
          type="number"
          min="0"
          max="100"
          step="0.01"
          placeholder="Note sur 100"
          required
        />

        <input
          v-model="form.commentaire"
          type="text"
          placeholder="Appréciation (facultatif)"
        />

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

    <!-- TABLEAU DES NOTES -->
    <div class="table-card">

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Étudiant</th>
            <th>Cours</th>
            <th>Note</th>
            <th>Appréciation</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr v-for="noteItem in notes" :key="noteItem.id">

            <td>{{ noteItem.id }}</td>

            <td>
              {{ noteItem.inscription?.etudiant?.matricule || '—' }}
            </td>

            <td>
              {{ noteItem.inscription?.cours?.nom || '—' }}
            </td>

            <td>
              {{ noteItem.note }}
            </td>

            <td>
              {{ noteItem.appreciation || '—' }}
            </td>

            <td class="actions">

              <button
                class="btn-edit"
                @click="modifier(noteItem)"
              >
                Modifier
              </button>

              <button
                class="btn-delete"
                @click="supprimer(noteItem.id)"
              >
                Supprimer
              </button>

            </td>

          </tr>

          <tr v-if="notes.length === 0">
            <td colspan="6" class="empty">
              Aucune note trouvée.
            </td>
          </tr>

        </tbody>

      </table>

    </div>

  </section>
</template>

<style scoped>
.notes-page {
  padding: 35px;
  color: #172554;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
}

.page-header p {
  color: #64748b;
  margin-top: 10px;
  font-size: 18px;
}

.form-card,
.table-card {
  background: white;
  padding: 30px;
  border-radius: 18px;
  margin-bottom: 25px;
  overflow-x: auto;
}

.form-card h2 {
  text-align: center;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

input,
select {
  min-width: 220px;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  font-size: 15px;
}

.form-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
}

button {
  border: none;
  padding: 13px 20px;
  border-radius: 9px;
  color: white;
  cursor: pointer;
}

.btn-primary {
  background: #2563eb;
}

.btn-cancel {
  background: #64748b;
}

.btn-edit {
  background: #f59e0b;
  margin: 3px;
}

.btn-delete {
  background: #dc2626;
  margin: 3px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 750px;
}

th {
  background: #f1f5f9;
  color: #172554;
}

th,
td {
  padding: 18px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

td {
  color: #64748b;
}

.empty {
  text-align: center;
  padding: 30px;
}

.message {
  background: #dcfce7;
  color: #166534;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

@media(max-width: 700px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .notes-page {
    padding: 15px;
  }
}
</style>
```