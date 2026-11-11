<script setup>
import { ref, onMounted } from 'vue'

const professeurs = ref([])
const chargement = ref(false)
const erreur = ref('')
const afficherFormulaire = ref(false)
const enregistrement = ref(false)
const modeModification = ref(false)
const professeurId = ref(null)

const nouveauProfesseur = ref({
  utilisateurId: '',
  departementId: '',
  specialite: '',
  telephone: '',
  adresse: ''
})

const reinitialiserFormulaire = () => {
  nouveauProfesseur.value = {
    utilisateurId: '',
    departementId: '',
    specialite: '',
    telephone: '',
    adresse: ''
  }
  modeModification.value = false
  professeurId.value = null
}

const chargerProfesseurs = async () => {
  chargement.value = true
  erreur.value = ''

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      'http://localhost:3000/api/professeurs',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Impossible de charger les professeurs')
    }

    professeurs.value = Array.isArray(result)
      ? result
      : result.donnees || []

  } catch (error) {
    erreur.value = error.message
  } finally {
    chargement.value = false
  }
}

const ouvrirModification = (professeur) => {
  professeurId.value = professeur.id

  nouveauProfesseur.value = {
    utilisateurId: professeur.utilisateurId,
    departementId: professeur.departementId,
    specialite: professeur.specialite || '',
    telephone: professeur.telephone || '',
    adresse: professeur.adresse || ''
  }

  modeModification.value = true
  afficherFormulaire.value = true
}

const enregistrerProfesseur = async () => {
  enregistrement.value = true

  try {
    const token = localStorage.getItem('token')

    const donnees = {
      utilisateurId: Number(nouveauProfesseur.value.utilisateurId),
      departementId: Number(nouveauProfesseur.value.departementId),
      specialite: nouveauProfesseur.value.specialite,
      telephone: nouveauProfesseur.value.telephone,
      adresse: nouveauProfesseur.value.adresse
    }

    const url = modeModification.value
      ? `http://localhost:3000/api/professeurs/${professeurId.value}`
      : 'http://localhost:3000/api/professeurs'

    const response = await fetch(url, {
      method: modeModification.value ? 'PUT' : 'POST',
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
        ? 'Professeur modifié avec succès !'
        : 'Professeur ajouté avec succès !'
    )

    afficherFormulaire.value = false
    reinitialiserFormulaire()
    await chargerProfesseurs()

  } catch (error) {
    alert(error.message)
  } finally {
    enregistrement.value = false
  }
}

const supprimerProfesseur = async (id) => {
  const confirmation = confirm(
    'Voulez-vous vraiment supprimer ce professeur ?'
  )

  if (!confirmation) return

  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      `http://localhost:3000/api/professeurs/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erreur lors de la suppression')
    }

    alert('Professeur supprimé avec succès !')
    await chargerProfesseurs()

  } catch (error) {
    alert(error.message)
  }
}

onMounted(chargerProfesseurs)
</script>

<template>
  <div class="professeurs-page">

    <div class="page-header">
      <div>
        <h1>Gestion des professeurs 👨‍🏫</h1>
        <p>Liste de tous les professeurs.</p>
      </div>

      <button
        class="add-button"
        @click="reinitialiserFormulaire(); afficherFormulaire = true"
      >
        + Ajouter un professeur
      </button>
    </div>

    <div v-if="afficherFormulaire" class="form-container">

      <h2>
        {{ modeModification ? 'Modifier un professeur' : 'Ajouter un professeur' }}
      </h2>

      <form @submit.prevent="enregistrerProfesseur">

        <label>ID de l'utilisateur</label>
        <input
          v-model="nouveauProfesseur.utilisateurId"
          type="number"
          min="1"
          required
        />

        <label>ID du département</label>
        <input
          v-model="nouveauProfesseur.departementId"
          type="number"
          min="1"
          required
        />

        <label>Spécialité</label>
        <input
          v-model="nouveauProfesseur.specialite"
          placeholder="Spécialité"
        />

        <label>Téléphone</label>
        <input
          v-model="nouveauProfesseur.telephone"
          placeholder="Téléphone"
        />

        <label>Adresse</label>
        <input
          v-model="nouveauProfesseur.adresse"
          placeholder="Adresse"
        />

        <div class="form-buttons">
          <button
            type="submit"
            class="add-button"
            :disabled="enregistrement"
          >
            {{ enregistrement ? 'Enregistrement...' : 'Enregistrer' }}
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

      <p v-if="chargement">Chargement des professeurs...</p>

      <p v-else-if="erreur" class="error">
        {{ erreur }}
      </p>

      <table v-else>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Département</th>
            <th>Spécialité</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="professeur in professeurs"
            :key="professeur.id"
          >
            <td>{{ professeur.utilisateur?.nom || '-' }}</td>
            <td>{{ professeur.utilisateur?.prenom || '-' }}</td>
            <td>{{ professeur.departement?.nom || professeur.departementId }}</td>
            <td>{{ professeur.specialite || '-' }}</td>
            <td>{{ professeur.telephone || '-' }}</td>
            <td>{{ professeur.adresse || '-' }}</td>

            <td>
              <button
                class="edit-button"
                @click="ouvrirModification(professeur)"
              >
                Modifier
              </button>

              <button
                class="delete-button"
                @click="supprimerProfesseur(professeur.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>

          <tr v-if="professeurs.length === 0">
            <td colspan="7" class="empty">
              Aucun professeur trouvé.
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<style scoped>
.professeurs-page {
  padding: 25px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.page-header h1,
.form-container h2 {
  color: #172554;
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

.form-container,
.table-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  overflow-x: auto;
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
}

.form-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.cancel-button {
  background: #e2e8f0;
  color: #172554;
  border: none;
  padding: 13px 20px;
  border-radius: 8px;
  cursor: pointer;
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

.edit-button,
.delete-button {
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 7px;
  cursor: pointer;
  margin-right: 6px;
}

.edit-button {
  background: #f59e0b;
}

.delete-button {
  background: #dc2626;
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