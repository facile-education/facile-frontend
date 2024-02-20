<template>
  <WeprodeWindow
    class="create-category-modal"
    data-test="create-category-modal"
    :modal="true"
    :draggable="true"
    :full-screen="mq.phone || mq.tablet"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'HelpModal.CreateCategoryModal.title'" />
    </template>

    <template #body>
      <WeprodeInput
        ref="nameInput"
        v-model="categoryName"
        class="name-input"
        :placeholder="$t('HelpModal.CreateCategoryModal.namePlaceHolder')"
      />

      <WeprodeDropdown
        v-model="selectedApplication"
        class="dropdown"
        :list="applicationList"
        :sort="false"
        display-field="applicationName"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('HelpModal.CreateCategoryModal.submit')"
        :disabled="categoryName.length === 0 || selectedApplication.applicationId === 0"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { getAllApplications } from '@/api/applicationManager.service'
import { saveCategory } from '@/api/help.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'CreateCategoryModal',
  components: { WeprodeButton, WeprodeDropdown, WeprodeInput, WeprodeWindow },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      categoryName: '',
      selectedApplication: { applicationId: 0, applicationName: 'Service' }, // TODO: Find a more satisfying way to do the dropdown placeholder
      applicationList: []
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.getApplicationList()
  },
  mounted () {
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    getApplicationList () {
      getAllApplications().then((data) => {
        if (data.success) {
          this.applicationList = data.services
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    submit () {
      saveCategory(this.categoryName, this.selectedApplication.applicationId).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/getHelpMenu', { query: '' })
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.name-input {
  margin-bottom: 15px;
}

.dropdown {
  width: 100%;
}

</style>
