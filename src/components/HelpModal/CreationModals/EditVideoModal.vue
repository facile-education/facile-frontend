<template>
  <WeprodeWindow
    class="edit-video-modal"
    data-test="edit-video-modal"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'HelpModal.EditVideoModal.title'" />
    </template>

    <template #body>
      <WeprodeInput
        ref="urlInput"
        v-model="videoUrlInput"
        class="url-input"
        :placeholder="$t('HelpModal.EditVideoModal.videoUrlPlaceHolder')"
      />

      <WeprodeInput
        v-model="videoDescriptionInput"
        :placeholder="$t('HelpModal.EditVideoModal.videoDescriptionPlaceHolder')"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('HelpModal.EditVideoModal.submit')"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import { saveItem } from '@/api/help.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'EditVideoModal',
  components: { WeprodeButton, WeprodeInput, WeprodeWindow },
  inject: ['mq'],
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
