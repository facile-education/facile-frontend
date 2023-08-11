<template>
  <PentilaWindow
    class="edit-video-modal"
    data-test="edit-video-modal"
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
        ref="urlInput"
        v-model="videoUrlInput"
        class="url-input"
        :placeholder="$t('videoUrlPlaceHolder')"
      />

      <PentilaInput
        v-model="videoDescriptionInput"
        :placeholder="$t('videoDescriptionPlaceHolder')"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { saveItem } from '@/api/help.service'

export default {
  name: 'EditVideoModal',
  props: {
    videoUrl: {
      type: String,
      required: true
    },
    videoDescription: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      videoUrlInput: '',
      videoDescriptionInput: ''
    }
  },
  computed: {
    selectedHelpArticle () {
      return this.$store.state.help.currentArticle
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    const input = this.$refs.urlInput
    input.focus()
    input.select()
    this.videoUrlInput = this.videoUrl
    this.videoDescriptionInput = this.videoDescription
  },
  methods: {
    submit () {
      const updatedArticle = JSON.parse(JSON.stringify(this.selectedHelpArticle))
      updatedArticle.videoUrl = this.videoUrlInput
      updatedArticle.videoDescription = this.videoUrlInput !== '' ? this.videoDescriptionInput : ''
      saveItem(0, updatedArticle).then((data) => { // No need of categoryId for item modification
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
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
.url-input {
  margin-bottom: 15px;
}
</style>

<i18n locale="fr">
{
  "title": "ÉDITER UNE VIDÉO",
  "videoUrlPlaceHolder": "Url de la vidéo (laisser vide pour aucune vidéo)",
  "videoDescriptionPlaceHolder": "Description",
  "submit": "Valider"
}
</i18n>
