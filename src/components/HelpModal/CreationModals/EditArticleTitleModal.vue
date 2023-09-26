<template>
  <PentilaWindow
    class="edit-title-modal"
    data-test="edit-title--modal"
    :full-screen="mq.phone || mq.tablet"
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
        ref="titleInput"
        v-model="titleInput"
        class="name-input"
        :placeholder="$t('titlePlaceHolder')"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        :disabled="titleInput.length === 0"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { saveItem } from '@/api/help.service'

export default {
  name: 'EdittitleInputModal',
  inject: ['mq'],
  props: {
    currentTitle: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      titleInput: ''
    }
  },
  computed: {
    selectedHelpArticle () {
      return this.$store.state.help.currentArticle
    }
  },
  created () {
    this.titleInput = this.currentTitle
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    const input = this.$refs.titleInput
    input.focus()
    input.select()
  },
  methods: {
    submit () {
      const updatedArticle = JSON.parse(JSON.stringify(this.selectedHelpArticle))
      updatedArticle.itemName = this.titleInput
      saveItem(0, updatedArticle).then((data) => { // No need of categoryId for item modification
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
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

</style>

<i18n locale="fr">
{
  "title": "ÉDITER LE MANUEL",
  "titlePlaceHolder": "Titre",
  "submit": "Valider"
}
</i18n>
