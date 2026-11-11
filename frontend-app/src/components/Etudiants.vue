```vue
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000/api/etudiants'

const etudiants = ref([])
const chargement = ref(false)
const erreur = ref('')
const afficherFormulaire = ref(false)
const enregistrement = ref(false)
const modeModification = ref(false)
const etudiantId = ref(null)

const nouveauEtudiant = ref({
  utilisateurId: '',
  matricule: '',
  dateNaissance: '',
  telephone: '',
  adresse: ''
})

const obtenirToken = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Vous devez vous connecter.')
  }

  return token
}

const reinitialiserFormulaire = () => {
  nouveauEtudiant.value = {
    utilisateurId: '',
    matricule: '',
    dateNaissance: '',
    telephone: '',
    adresse: ''
  }

  etudiantId.value = null
  modeModification.value = false
}

const chargerEtudiants = async () => {
  chargement.value = true
  erreur.value = ''

  try {
    const token = obtenirToken()

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Impossible de charger les étudiants')
    }

    etudiants.value = Array.isArray(result)
      ? result
      : result.donnees || []

  } catch (error) {
    erreur.value = error.message
  } finally {
    chargement.value = false
  }
}

const ouvrirAjout = () => {
  reinitialiserFormulaire()
  afficherFormulaire.value = true
}

const ouvrirModification = (etudiant) => {
  etudiantId.value = etudiant.id
  modeModification.value = true

  nouveauEtudiant.value = {
    utilisateurId: etudiant.utilisateurId || etudiant.utilisateur?.id || '',
    matricule: etudiant.matricule || '',
    dateNaissance: etudiant.dateNaissance || '',
    telephone: etudiant.telephone || '',
    adresse: etudiant.adresse || ''
  }

  afficherFormulaire.value = true
}

const enregistrerEtudiant = async () => {
  enregistrement.value = true

  try {
    const token = obtenirToken()

    const donnees = {
      utilisateurId: Number(nouveauEtudiant.value.utilisateurId),
      matricule: nouveauEtudiant.value.matricule,
      dateNaissance: nouveauEtudiant.value.dateNaissance || null,
      telephone: nouveauEtudiant.value.telephone,
      adresse: nouveauEtudiant.value.adresse
    }

    const url = modeModification.value
      ? `${API_URL}/${etudiantId.value}`
      : API_URL

    const method = modeModification.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(donnees)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de l’enregistrement')
    }

    alert(
      modeModification.value
        ? 'Étudiant modifié avec succès !'
        : 'Étudiant ajouté avec succès !'
    )

    afficherFormulaire.value = false
    reinitialiserFormulaire()

    await chargerEtudiants()

  } catch (error) {
    alert(error.message)
  } finally {
    enregistrement.value = false
  }
}

const supprimerEtudiant = async (id) => {
  const confirmation = confirm(
    'Voulez-vous vraiment supprimer cet étudiant ?'
  )

  if (!confirmation) return

  try {
    const token = obtenirToken()

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la suppression')
    }

    alert('Étudiant supprimé avec succès !')

    await chargerEtudiants()

  } catch (error) {
    alert(error.message)
  }
}

onMounted(chargerEtudiants)
</script>

<template>
  <div class="etudiants-page">

    <div class="page-header">
      <div>
        <h1>Gestion des étudiants 🎓</h1>
        <p>Liste de tous les étudiants inscrits.</p>
      </div>

      <button class="add-button" @click="ouvrirAjout">
        + Ajouter un étudiant
      </button>
    </div>

    <div v-if="afficherFormulaire" class="form-container">

      <h2>
        {{ modeModification ? 'Modifier un étudiant' : 'Ajouter un étudiant' }}
      </h2>

      <form @submit.prevent="enregistrerEtudiant">

        <label>ID de l'utilisateur</label>
        <input
          v-model="nouveauEtudiant.utilisateurId"
          type="number"
          min="1"
          placeholder="Exemple : 2"
          required
        />

        <label>Matricule</label>
        <input
          v-model="nouveauEtudiant.matricule"
          placeholder="Matricule de l'étudiant"
          required
        />

        <label>Date de naissance</label>
        <input
          v-model="nouveauEtudiant.dateNaissance"
          type="date"
        />

        <label>Téléphone</label>
        <input
          v-model="nouveauEtudiant.telephone"
          placeholder="Téléphone"
        />

        <label>Adresse</label>
        <input
          v-model="nouveauEtudiant.adresse"
          placeholder="Adresse"
        />

        <div class="form-buttons">

          <button
            type="submit"
            class="add-button"
            :disabled="enregistrement"
          >
            {{
              enregistrement
                ? 'Enregistrement...'
                : modeModification
                  ? 'Enregistrer les modifications'
                  : 'Enregistrer'
            }}
          </button>

          <button
            type="button"
            class="cancel-button"
            @click="afficherFormulaire = false; reinitialiserFormulaire()"
          >
            Annuler
          </button>

        </div>

      </form>
    </div>

    <div class="table-container">

      <p v-if="chargement">
        Chargement des étudiants...
      </p>

      <p v-else-if="erreur" class="error">
        {{ erreur }}
      </p>

      <table v-else>

        <thead>
          <tr>
            <th>ID</th>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de naissance</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="etudiant in etudiants"
            :key="etudiant.id"
          >
            <td>{{ etudiant.id }}</td>
            <td>{{ etudiant.matricule }}</td>
            <td>{{ etudiant.utilisateur?.nom || '-' }}</td>
            <td>{{ etudiant.utilisateur?.prenom || '-' }}</td>
            <td>{{ etudiant.dateNaissance || '-' }}</td>
            <td>{{ etudiant.telephone || '-' }}</td>
            <td>{{ etudiant.adresse || '-' }}</td>

            <td class="actions">

              <button
                class="edit-button"
                @click="ouvrirModification(etudiant)"
              >
                Modifier
              </button>

              <button
                class="delete-button"
                @click="supprimerEtudiant(etudiant.id)"
              >
                Supprimer
              </button>

            </td>
          </tr>

          <tr v-if="etudiants.length === 0">
            <td colspan="8" class="empty">
              Aucun étudiant trouvé.
            </td>
          </tr>

        </tbody>
      </table>

    </div>

  </div>
</template>

<style scoped>
.etudiants-page {
  padding: 25px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.page-header h1 {
  color: #172554;
  font-size: 25px;
}

.page-header p {
  color: #64748b;
  margin-top: 8px;
}

.add-button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 13px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.add-button:hover {
  background: #1d4ed8;
}

.add-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-container h2 {
  color: #172554;
  margin-bottom: 20px;
}

.form-container form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-container label {
  color: #172554;
  font-weight: bold;
}

.form-container input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  margin-bottom: 8px;
}

.form-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cancel-button {
  background: #e2e8f0;
  color: #172554;
  border: none;
  padding: 13px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.table-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

th {
  color: #172554;
  background: #f8fafc;
}

td {
  color: #64748b;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-button {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 9px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.delete-button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 9px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.empty {
  text-align: center;
}

.error {
  color: red;
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-container form {
    grid-template-columns: 1fr;
  }
}
</style>
```