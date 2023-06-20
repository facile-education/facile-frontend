<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="addAffectedUserWindow"
    :width="600"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'add-affected-user-title'" />
    </template>

    <template #body>
      <div class="user">
        <PentilaTagsInput
          ref="tagsinput"
          v-model="selectedUsers"
          :close-on-select="true"
          :completion-only="true"
          :min-length="3"
          :placeholder="$t('completionPlaceholder')"
          display-field="nameAndRole"
          id-field="userId"
          :list="schoolMembers"
          class="tags"
          @inputChange="searchMembers"
        />
        <PentilaErrorMessage :error-message="formErrorList.selectedUsers" />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('add')"
        class="button"
        @click="addUsers"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { getSchoolUsers } from '@/api/userSearch.service'

export default {
  name: 'AddAffectedUserModal',
  inject: ['mq'],
  emits: ['close', 'newUsers'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    selectedUsers: { required }
  },
  data () {
    return {
      schoolMembers: [],
      selectedUsers: [],
      timeout: undefined
    }
  },
  computed: {
    formErrorList () {
      return {
        selectedUsers: (this.v$.selectedUsers.$invalid && this.v$.selectedUsers.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  mounted () {
    this.runSearch('')
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    searchMembers (inputValue) {
      clearTimeout(this.timeout)
      // Make a new timeout set to go off in 500ms
      if (inputValue.length >= 2) { // nbCharBeforeCompletion
        this.timeout = setTimeout(() => {
          this.runSearch(inputValue)
        }, 500)
      } else {
        this.schoolMembers.length = 0
      }
    },
    runSearch (filter) {
      getSchoolUsers(this.$store.state.user.selectedSchool.schoolId, filter).then(
        (data) => {
          if (data.success) {
            this.schoolMembers = data.users
            this.schoolMembers.forEach((member) => {
              member.nameAndRole = member.fullName + ' (' + member.roles + ')'
            })
          }
        }
      )
    },
    addUsers () {
      this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.added'), type: 'success' })
      this.$emit('newUsers', this.selectedUsers)
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.addDelegationWindow {
  span {
    text-align: center;
    margin: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "add-affected-user-title": "Ajouter un utilisateur pour affectation",
  "completionPlaceholder": "Saisir le nom ou prénom",
  "add": "Ajouter",
  "Popup": {
    "added": "Utilisateur(s) ajouté(s)"
  }
}
</i18n>
