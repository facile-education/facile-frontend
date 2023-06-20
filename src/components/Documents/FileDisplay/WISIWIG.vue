<template>
  <div class="container">
    <TextContent
      v-if="loaded && initialContent.contentValue !== undefined"
      class="ck"
      :maximised="true"
      :content="initialContent"
      :disabled="readOnly"
      :is-in-progression="false"
      @input="updateContent"
    />
  </div>
</template>

<script>
import TextContent from '@components/Progression/Edit/Contents/TextContent'

import fileServices from '@/api/documents/file.service'
import { fileAutoSaveTime } from '@/constants/appConstants'

export default {
  name: 'WISIWIG',
  components: { TextContent },
  props: {
    file: {
      type: Object,
      required: true
    },
    haveToSave: {
      type: Boolean,
      default: false
    }
  },
  emits: ['saved'],
  data () {
    return {
      counter: undefined,
      loaded: false,
      readOnly: false,
      initialContent: {},
      currentContent: {}
    }
  },
  watch: {
    haveToSave () {
      if (this.haveToSave) {
        this.saveContent()
      }
    }
  },
  created () {
    this.getContent()
    this.autoSave()
  },
  update () { // Additional lock to avoid data loss in case of application closure (do not use in normal behavior because of the display data update (lastModifiedDate, etc...) // doesn't seems to works in many cases... (I try beforeUnmount and unmounted without more success)
    if (!this.haveToSave && !this.file.readOnly) {
      this.saveContent(this.content)
    }
  },
  beforeUnmount () {
    clearInterval(this.counter)
  },
  methods: {
    getContent () {
      fileServices.getHtmlContent(this.file.fileVersionId).then((data) => {
        if (data.content === '') {
          data.content = '<p>texte</p>'
        }
        this.initialContent.contentValue = this.currentContent.contentValue = data.content
        this.initialContent.order = 1 // display only one editor at time with this component
        this.readOnly = this.file.readOnly
        this.loaded = true
      })
    },
    updateContent (value) {
      this.currentContent.contentValue = value
    },
    saveContent (majorVersion = true) {
      if (!this.readOnly) {
        if (this.currentContent.contentValue !== this.initialContent.contentValue) {
          fileServices.saveHtmlContent(this.file.fileVersionId, this.currentContent.contentValue, majorVersion).then((data) => {
            if (data.success) {
              this.$emit('saved')
              this.$store.dispatch('popups/pushPopup', { message: this.$t('documentSaved'), type: 'info' })
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('saveError'), type: 'error' })
            }
          })
        } else { // If content is the same, no need to call the WS
          this.$emit('saved')
        }
      }
    },
    autoSave () {
      // Call again the autoSave method
      this.counter = setInterval(() => {
        this.saveContent(false)
      }, fileAutoSaveTime)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.container{
  border: 1px solid $color-border;
  height: 100%;
  width: 100%;

  .ck {
    height: 100%;
  }
}
</style>

<i18n locale="fr">
{
  "documentSaved": "Document sauvegardé!",
  "saveError": "Erreur lors de l'enregistrement du fichier"
}
</i18n>
