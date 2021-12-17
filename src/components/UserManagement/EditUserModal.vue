<template>
  <PentilaWindow
    :modal="true"
    class="editUserWindow"
    win-width="600px"
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
      <PentilaDropdown
        v-if="schools"
        v-model="selectedSchool"
        class="schools"
        :list="schools"
        :sort="true"
        display-field="schoolName"
      />
      <PentilaDropdown
        v-if="(roles && roles.length > 1)"
        v-model="selectedRole"
        class="roles"
        :list="roles"
        :sort="true"
        display-field="roleName"
      />
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('cancel')"
        class="button"
        @click="closeModal"
      />
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
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

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
    email: { required }
  },
  data () {
    return {
      lastName: '',
      firstName: '',
      email: '',
      selectedSchool: undefined,
      selectedRole: undefined
    }
  },
  computed: {
    isCreation () {
      return this.editedUser.userId === undefined
    },
    schools () {
      return this.$store.state.userManagement.schools
    },
    roles () {
      return this.$store.state.userManagement.roles
    },
    formErrorList () {
      return {
        lastName: (this.v$.lastName.$invalid && this.v$.lastName.$dirty) ? this.$t('Commons.required') : '',
        firstName: (this.v$.firstName.$invalid && this.v$.firstName.$dirty) ? this.$t('Commons.required') : '',
        email: (this.v$.email.$invalid && this.v$.email.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('userManagement/getRoles')
    if (!this.isCreation) {
      this.lastName = this.editedUser.lastName
      this.firstName = this.editedUser.firstName
      this.email = this.editedUser.email
    }
    this.selectedSchool = this.schools[0]

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
        console.log('this.selectedRole=', this.selectedRole)
        console.log('this.selectedSchool=', this.selectedSchool)
        this.$store.dispatch('userManagement/createManualUser',
          { lastName: this.lastName, firstName: this.firstName, email: this.email, roleId: this.selectedRole.roleId, schoolId: this.selectedSchool.schoolId })
        this.closeModal()
      }
    },
    editUser (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('userManagement/editManualUser',
          { userId: this.editedUser.userId, lastName: this.lastName, firstName: this.firstName, email: this.email, roleId: this.selectedRole.roleId, schoolId: this.selectedSchool.schoolId })
        this.closeModal()
      }
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
}
</style>

<i18n locale="fr">
{
  "creation-title": "Créer un utilisateur",
  "edition-title": "Modifier un utilisateur",
  "cancel": "Annuler",
  "add": "Créer",
  "edit": "Modifier",
  "lastNamePlaceholder": "Nom",
  "firstNamePlaceholder": "Prénom",
  "emailPlaceholder": "Mail"
}
</i18n>
