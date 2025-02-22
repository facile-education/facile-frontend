<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="add-affected-user-modal"
    :width="600"
    :full-screen="mq.phone || mq.tablet"
    :class="{'mobile': mq.phone || mq.tablet}"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'UserManagement.AddAffectedUserModal.add-affected-user-title'" />
    </template>

    <template #body>
      <div class="user">
        <WeprodeTagsInput
          ref="tagsinput"
          v-model="selectedUsers"
          :close-on-select="true"
          :completion-only="true"
          :min-length="3"
          :is-tag-clickable="(item) => item.type === contactTypeUser"
          :placeholder="$t('UserManagement.AddAffectedUserModal.completionPlaceholder')"
          display-field="nameAndRole"
          id-field="userId"
          :list="schoolMembers"
          class="tags"
          @input-change="searchMembers"
        />
        <WeprodeErrorMessage :error-message="formErrorList.selectedUsers" />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        :label="$t('UserManagement.AddAffectedUserModal.add')"
        class="button"
        @click="addUsers"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { getSchoolMembers } from '@/api/userSearch.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'AddAffectedUserModal',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeTagsInput, WeprodeWindow },
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
      getSchoolMembers(this.$store.state.user.selectedSchool.schoolId, filter).then(
        (data) => {
          if (data.success) {
            this.schoolMembers = data.users
            this.schoolMembers.forEach((member) => {
              member.nameAndRole = member.lastName + ' ' + member.firstName + ' (' + member.roles + ')'
            })
          }
        }
      )
    },
    addUsers () {
      this.$store.dispatch('popups/pushPopup', { message: this.$t('UserManagement.AddAffectedUserModal.added'), type: 'success' })
      this.$emit('newUsers', this.selectedUsers)
      this.closeModal()
    }
  }
}
</script>

<style lang="scss">
.add-affected-user-modal {
  .window-body {
    overflow: visible !important;
  }
}
</style>
