<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="editUserWindow"
    :width="600"
    :full-screen="mq.phone || mq.tablet"
    :class="{'mobile': mq.phone || mq.tablet}"
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
        <WeprodeInput
          ref="lastNameInput"
          v-model="lastName"
          :maxlength="200"
          :placeholder="$t('lastNamePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.lastName"
        />
      </div>
      <div class="firstName">
        <WeprodeInput
          ref="firstNameInput"
          v-model="firstName"
          :maxlength="200"
          :placeholder="$t('firstNamePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.firstName"
        />
      </div>
      <div class="email">
        <WeprodeInput
          ref="emailInput"
          v-model="email"
          :maxlength="200"
          :placeholder="$t('emailPlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.email"
        />
      </div>

      <!-- School -->
      <div class="school">
        <p v-t="'school'" />
        <WeprodeDropdown
          v-if="(schoolList && schoolList.length > 1 && !isParent)"
          v-model="school"
          :list="schoolList"
          display-field="schoolName"
        />
        <p v-else>
          {{ editedUser.schoolName }}
        </p>
      </div>

      <!-- Role -->
      <div
        v-if="(roleList && roleList.length > 1 && !isParent)"
        class="role"
      >
        <p v-t="'role'" />
        <WeprodeDropdown
          v-model="selectedRole"
          :list="roleList"
          display-field="label"
        />
      </div>

      <!-- Children -->
      <p
        v-if="!isCreation && isParent"
      >
        {{ parentInfos }}
      </p>

      <!-- Screen name -->
      <p
        v-if="!isCreation && isParent"
      >
        {{ $t('parent-account') }}{{ screenName }}
      </p>

      <p
        v-if="isCreation"
        v-t="'email-warning'"
      />

      <div
        v-if="!isCreation"
        class="password"
      >
        <WeprodeInput
          v-model="password"
          :placeholder="$t('passwordPlaceholder')"
          :maxlength="75"
        />
        <WeprodeButton
          class="round"
          @click="updatePassword"
        >
          <span>{{ $t('update-password') }}</span>
        </WeprodeButton>
      </div>
      <p
        v-if="!isCreation"
        v-t="'password-policy'"
      />
    </template>

    <template #footer>
      <WeprodeButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        @click="createUser"
      />
      <WeprodeButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editUser"
      />
      <WeprodeButton
        v-if="!isCreation"
        :label="$t('delete')"
        class="button"
        @click="confirmUserRemoval"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'

import { getLocalUserRoleList } from '@/api/role.service'
import userService from '@/api/user.service'
import { createManualUser, editManualUser, removeManualUser, updatePasswordByManager } from '@/api/userManagement.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import store from '@/store'

export default {
  name: 'EditUserModal',
  components: { WeprodeButton, WeprodeDropdown, WeprodeErrorMessage, WeprodeInput, WeprodeWindow },
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
      school: undefined,
      roleList: [],
      isParent: false,
      screenName: '',
      parentInfos: '',
      password: ''
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
      return this.$store.state.userManagement.roles
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
    getLocalUserRoleList().then((data) => {
      if (data.success) {
        this.roleList = data.roles

        if (!this.isCreation) {
          this.lastName = this.editedUser.lastName
          this.firstName = this.editedUser.firstName
          this.email = this.editedUser.email
          this.isParent = this.editedUser.isParent
          this.screenName = this.editedUser.screenName
          const roleIndex = this.roleList.map(role => role.roleId).indexOf(this.editedUser.roleId)
          this.selectedRole = this.roleList[roleIndex]
          const schoolIndex = this.schoolList.map(school => school.schoolId).indexOf(this.editedUser.schoolId)
          this.school = this.schoolList[schoolIndex]
        } else {
          this.school = this.selectedSchool
        }
      }
    })

    // Get children if parent
    if (this.editedUser.isParent) {
      userService.getParentInfos(this.editedUser.userId).then((data) => {
        if (data.success) {
          this.parentInfos = data.infos
        }
      })
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
              this.$store.dispatch('popups/pushPopup', { message: this.$t('userAdded'), type: 'success' })
              this.closeModal()
            } else if (data.errorCode === 'email') {
              store.dispatch('popups/pushPopup', { type: 'error', message: this.$t('existingEmail') })
            } else {
              store.dispatch('popups/pushPopup', { type: 'error', message: this.$t('popupError') })
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
        // Manage roleId for parents
        const roleId = this.selectedRole !== undefined ? this.selectedRole.roleId : this.editedUser.roleId
        editManualUser(this.editedUser.userId, this.lastName, this.firstName, this.email, roleId, this.selectedSchool.schoolId).then(
          (data) => {
            if (data.success) {
              this.$store.dispatch('userManagement/editManualUser', data.user)
              this.$store.dispatch('popups/pushPopup', { message: this.$t('userEdited'), type: 'success' })
              this.closeModal()
            } else if (data.errorCode === 'email') {
              store.dispatch('popups/pushPopup', { type: 'error', message: this.$t('existingEmail') })
            } else {
              store.dispatch('popups/pushPopup', { type: 'error', message: this.$t('popupError') })
            }
          }
        )
      }
    },
    confirmUserRemoval () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('delete-warning'),
        lastAction: { fct: this.removeUser, params: [this.editedUser] }
      })
    },
    removeUser (user) {
      removeManualUser(user.userId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('userManagement/removeManualUser', user)
            this.$store.dispatch('popups/pushPopup', { message: this.$t('userRemoved'), type: 'success' })
            this.closeModal()
          }
        }
      )
    },
    updatePassword () {
      updatePasswordByManager(this.editedUser.userId, this.password).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .editUserWindow .window-body {
    overflow: visible !important;
  }
</style>

<style lang="scss" scoped>
.editUserWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .lastName,.firstName,.email, .school, .role {
    width: 100%;
    margin-bottom: 5px;
  }
  .school, .role {
    display: flex;
    p {
      margin-right: 1em;
    }
  }
  .password {
    display: flex;
    gap: 20px;
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
  "edit": "Valider",
  "delete": "Supprimer",
  "lastNamePlaceholder": "Nom",
  "firstNamePlaceholder": "Prénom",
  "emailPlaceholder": "Mail",
  "school": "Établissement",
  "role": "Profil",
  "parent-account": "Identifiant: {0}",
  "email-warning": "NB: Un e-mail contenant les informations d'authentification sera envoyé à l'utilisateur créé.",
  "delete-warning": "La suppression de cet utilisateur est définitive.",
  "userAdded": "Utilisateur créé",
  "userEdited": "Utilisateur modifié",
  "userRemoved": "Utilisateur supprimé",
  "popupError": "Une erreur est survenue. Merci de réessayer",
  "existingEmail": "L'adresse e-mail existe déjà. Vous pouvez utiliser le service affectation pour affecter l'utilisateur à votre établissement.",
  "passwordPlaceholder": "Nouveau mot de passe",
  "update-password": "Changer le mot de passe",
  "password-policy": "Le mot de passe doit contenir au moins 8 caractères dont une majuscule, un chiffre et un caractère spécial",
  "success": "Mot de passe changé",
  "error": "Erreur lors du changement de mot de passe"
}
</i18n>
