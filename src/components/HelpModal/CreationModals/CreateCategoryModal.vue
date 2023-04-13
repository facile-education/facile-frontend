<template>
  <PentilaWindow
    class="create-category-modal"
    data-test="create-category-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <PentilaInput
        ref="nameInput"
        v-model="categoryName"
        class="name-input"
        :placeholder="$t('namePlaceHolder')"
      />

      <PentilaDropdown
        v-model="selectedService"
        class="dropdown"
        :list="serviceList"
        :sort="false"
        display-field="serviceName"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        :disabled="categoryName.length === 0 || selectedService.serviceId === 0"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { getAllApplications } from '@/api/applicationManager.service'
import { saveCategory } from '@/api/help.service'

export default {
  name: 'CreateCategoryModal',
  emits: ['close'],
  data () {
    return {
      categoryName: '',
      selectedService: { serviceId: 0, serviceName: 'Service' }, // TODO: Find a more satisfying way to do the dropdown placeholder
      serviceList: []
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.getServiceList()
  },
  mounted () {
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    getServiceList () {
      getAllApplications().then((data) => {
        if (data.success) {
          this.serviceList = data.services
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    submit () {
      saveCategory(this.categoryName, this.selectedService.serviceId).then((data) => {
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

<i18n locale="fr">
{
  "title": "CRÉER UNE CATEGORIE",
  "namePlaceHolder": "Titre",
  "submit": "Valider"
}
</i18n>
