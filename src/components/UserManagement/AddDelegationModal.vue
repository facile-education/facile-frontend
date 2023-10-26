<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="add-delegation-window"
    :width="600"
    :full-screen="mq.phone || mq.tablet"
    :class="{'mobile': mq.phone || mq.tablet}"
    @close="closeModal"
  >
    <template #header>
      <span
        v-t="'add-delegation-title'"
      />
    </template>

    <template #body>
      <div class="delegates">
        <WeprodeTagsInput
          ref="tagsinput"
          v-model="selectedDelegates"
          :close-on-select="true"
          :completion-only="true"
          :min-length="3"
          :placeholder="$t('completionPlaceholder')"
          display-field="fullName"
          id-field="userId"
          :list="delegationCandidates"
          class="tags"
          @inputChange="searchCandidates"
        />
        <WeprodeErrorMessage :error-message="formErrorList.selectedDelegates" />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        :label="$t('add')"
        class="button"
        @click="addDelegations"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { getDelegationCandidates } from '@/api/userManagement.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'AddDelegationModal',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeTagsInput, WeprodeWindow },
  inject: ['mq'],
  props: {
  },
  emits: ['close', 'addedDelegates'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    selectedDelegates: { required }
  },
  data () {
    return {
      delegationCandidates: [],
      selectedDelegates: [],
      timeout: undefined
    }
  },
  computed: {
    formErrorList () {
      return {
        selectedDelegates: (this.v$.selectedDelegates.$invalid && this.v$.selectedDelegates.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  mounted () {
    getDelegationCandidates(this.$store.state.user.selectedSchool.schoolId, '').then(
      (data) => {
        if (data.success) {
          this.delegationCandidates = data.candidates
        }
      }
    )
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    searchCandidates (inputValue) {
      clearTimeout(this.timeout)
      // Make a new timeout set to go off in 800ms
      if (inputValue.length >= 2) { // nbCharBeforeCompletion
        this.timeout = setTimeout(() => {
          getDelegationCandidates(this.$store.state.user.selectedSchool.schoolId, inputValue).then(
            (data) => {
              if (data.success) {
                this.delegationCandidates = data.candidates
              }
            }
          )
        }, 500)
      } else {
        this.delegationCandidates.length = 0
      }
    },
    addDelegations () {
      this.$emit('addedDelegates', this.selectedDelegates)
      this.closeModal()
    }
  }
}
</script>

<style lang="scss">
.add-delegation-window {
  .window-body {
    overflow: visible !important;
  }
}
</style>

<style lang="scss" scoped>
.add-delegation-window {
  span {
    text-align: center;
    margin: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "add-delegation-title": "Ajouter une délégation",
  "completionPlaceholder": "Saisir le nom ou prénom",
  "add": "Ajouter"
}
</i18n>
