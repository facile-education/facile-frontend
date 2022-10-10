<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="editUserWindow"
    :width="600"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span
        v-if="isCreation"
        v-t="'creation-title'"
      />
      <span
        v-else
        v-t="'edition-title'"
      />
    </template>

    <template #body>
      <div class="lastName">
        <PentilaInput
          ref="lastNameInput"
          v-model="lastName"
          :maxlength="200"
          :placeholder="$t('lastNamePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.lastName"
        />
      </div>
      <div class="firstName">
        <PentilaInput
          ref="firstNameInput"
          v-model="firstName"
          :maxlength="200"
          :placeholder="$t('firstNamePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.firstName"
        />
      </div>
      <div class="email">
        <PentilaInput
          ref="emailInput"
          v-model="email"
          :maxlength="200"
          :placeholder="$t('emailPlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.email"
        />
      </div>

      <!-- School -->
      <div class="school">
        <p>Etablissement</p>
        <PentilaDropdown
          v-if="(schoolList && schoolList.length > 1)"
          v-model="school"
          :list="schoolList"
          display-field="schoolName"
        />
        <p v-else>
          {{ schoolList[0].schoolName }}
        </p>
      </div>

      <!-- Role -->
      <div class="role">
        <p>Profil</p>
        <PentilaDropdown
          v-if="(roles && roles.length > 1)"
          v-model="selectedRole"
          :list="roles"
          display-field="label"
        />
      </div>
      <p
        v-if="isCreation"
        v-t="'email-warning'"
      />
    </template>

    <template #footer>
      <PentilaButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        @click="createUser"
      />
      <PentilaButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editUser"
      />
      <PentilaButton
        v-if="!isCreation"
        :label="$t('delete')"
        class="button"
        @click="confirmUserRemoval"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import PentilaUtils from 'pentila-utils'
import { createManualUser, editManualUser } from '@/api/userManagement.service'
import store from '@/store'

export default {
  name: 'EditUserModal',
  inject: ['mq'],
  props: {
    editedUser: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    lastName: { required },
    firstName: { required },
    email: { required, email }
  },
  data () {
    return {
      lastName: '',
      firstName: '',
      email: '',
      selectedRole: undefined,
      school: undefined
    }
  },
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
    },
    isCreation () {
      return this.editedUser.userId === undefined
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    roles () {
      return PentilaUtils.Array.sortWithString(this.$store.state.userManagement.roles, true, 'roleCode')
    },
    formErrorList () {
      return {
        lastName: (this.v$.lastName.$invalid && this.v$.lastName.$dirty) ? this.$t('Commons.required') : '',
        firstName: (this.v$.firstName.$invalid && this.v$.firstName.$dirty) ? this.$t('Commons.required') : '',
        email: (this.v$.email.$invalid && this.v$.email.$dirty) ? this.$t('Commons.formInvalidEmail') : ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('userManagement/getRoles')
    if (!this.isCreation) {
      this.lastName = this.editedUser.lastName
      this.firstName = this.editedUser.firstName
      this.email = this.editedUser.email
      const roleIndex = this.roles.map(role => role.roleId).indexOf(this.editedUser.roleId)
      this.selectedRole = this.roles[roleIndex]
      const schoolIndex = this.schoolList.map(school => school.schoolId).indexOf(this.editedUser.schoolId)
      this.school = this.schoolList[schoolIndex]
    } else {
      this.school = this.selectedSchool
    }

    // Focus form
    const input = this.$refs.lastNameInput
    input.focus()
    input.select()
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    pressEnter (e) {
      this.isCreation ? this.createUser(e) : this.editUser(e)
    },
    createUser (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        createManualUser(this.lastName, this.firstName, this.email, this.selectedRole.roleId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              this.$store.dispatch('userManagement/addManualUser', data.user)
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.userAdded'), type: 'success' })
              this.closeModal()
            } else if (data.errorCode === 'email') {
              store.dispatch('popups/pushPopup', { type: 'error', message: 'L\'e-mail de cet utilisateur existe déjà dans l\'ENT.' })
            } else {
              store.dispatch('popups/pushPopup', { type: 'error', message: 'Une erreur est survenue.' })
            }
          }
        )
      }
    },
    editUser (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        editManualUser(this.editedUser.userId, this.lastName, this.firstName, this.email, this.selectedRole.roleId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              this.$store.dispatch('userManagement/editManualUser', data.user)
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.userEdited'), type: 'success' })
              this.closeModal()
            } else if (data.errorCode === 'email') {
              store.dispatch('popups/pushPopup', { type: 'error', message: 'L\'e-mail de cet utilisateur existe déjà dans l\'ENT.' })
            } else {
              store.dispatch('popups/pushPopup', { type: 'error', message: 'Une erreur est survenue.' })
            }
          }
        )
      }
    },
    confirmUserRemoval (user) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('delete-warning'),
        lastAction: { fct: this.removeUser, params: [user] }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editUserWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .lastName,.firstName,.email {
    margin-bottom: 5px;
  }
  .school, .role {
    display: flex;
    p {
      margin-right: 1em;
    }
  }
  .button {
    margin-right: 1em;
  }
}
</style>

<i18n locale="fr">
{
  "creation-title": "Créer un utilisateur",
  "edition-title": "Modifier un utilisateur",
  "add": "Créer",
  "edit": "Modifier",
  "delete": "Supprimer",
  "lastNamePlaceholder": "Nom",
  "firstNamePlaceholder": "Prénom",
  "emailPlaceholder": "Mail",
  "email-warning": "NB: Un e-mail contenant les informations d'authentification sera envoyé à l'utilisateur créé.",
  "delete-warning": "La suppression de cet utilisateur est définitive.",
  "Popup": {
    "userAdded": "Utilisateur créé",
    "userEdited": "Utilisateur modifié"
  }
}
</i18n>
