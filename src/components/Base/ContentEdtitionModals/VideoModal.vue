<template>
  <WeprodeWindow
    :modal="true"
    class="videoWindow"
    :width="600"
    :class="{'mobile': mq.phone, 'readOnly': readOnly}"
    :full-screen="readOnly"
    @close="closeModal"
  >
    <template #header>
      <span v-if="readOnly">
        {{ editedContent.contentName }}
      </span>
      <span
        v-else-if="isCreation"
        v-t="'creation-title'"
      />
      <span
        v-else
        v-t="'edition-title'"
      />
    </template>

    <template #body>
      <div
        v-if="!readOnly"
        class="video-name"
      >
        <WeprodeInput
          ref="nameInput"
          v-model="videoName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.videoName"
        />
      </div>
      <div
        v-if="!readOnly"
        class="video-url"
      >
        <WeprodeInput
          v-model="contentValue"
          :placeholder="$t('urlPlaceholder')"
          :maxlength="2000"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.embedHTMLElement || formErrorList.embedSrcAttribute || urlError"
        />
      </div>

      <iframe
        v-if="embedSrcAttribute"
        :src="embedSrcAttribute"
        title="video content"
        class="video-preview"
      />
    </template>

    <template
      v-if="!readOnly"
      #footer
    >
      <WeprodeButton
        v-if="isCreation"
        :label="$t('add')"
        class="button create-button"
        data-test="addVideo"
        @click="addVideo"
      />
      <WeprodeButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editVideo"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { isEmbedUrlWhitelisted } from '@/api/course.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'VideoModal',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeInput, WeprodeWindow },
  inject: ['mq'],
  props: {
    item: {
      type: Object,
      default: () => { return undefined }
    },
    editedContent: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    videoName: { required },
    embedHTMLElement: { required },
    embedSrcAttribute: { required }
  },
  data () {
    return {
      videoName: '',
      contentValue: '',
      urlError: ''
    }
  },
  computed: {
    isCreation () {
      return this.editedContent.contentId === undefined
    },
    formErrorList () {
      return {
        videoName: (this.v$.videoName.$invalid && this.v$.videoName.$dirty) ? this.$t('Commons.required') : '',
        embedHTMLElement: (this.v$.embedHTMLElement.$invalid && this.v$.embedHTMLElement.$dirty) ? this.$t('embedElementCheckFailed', { embedText: '<embed src="https://peertube.fr/videos/embed/7da97aab-a57b-40ec-bcbf-53ece033dae6">' }) : '',
        embedSrcAttribute: (this.v$.embedSrcAttribute.$invalid && this.v$.embedSrcAttribute.$dirty) ? this.$t('srcRequired') : ''
      }
    },
    embedHTMLElement () {
      const tmp = document.createElement('div')
      tmp.innerHTML = this.contentValue
      let embed = tmp.getElementsByTagName('embed')[0]
      if (!embed) { // embed element can be an <embed/> or an <iframe/> tag
        embed = tmp.getElementsByTagName('iframe')[0]
      }
      return embed
    },
    embedSrcAttribute () {
      return this.embedHTMLElement ? this.embedHTMLElement.getAttribute('src') : undefined
    }
  },
  watch: {
    embedSrcAttribute () {
      this.urlError = '' // Reset URL error when url change
    }
  },
  mounted () {
    if (!this.isCreation) {
      this.videoName = this.editedContent.contentName
      this.contentValue = '<iframe src="' + this.editedContent.contentValue + '" />'
    }

    // Focus form
    if (!this.readOnly) {
      const input = this.$refs.nameInput
      input.focus()
      input.select()
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    pressEnter (e) {
      this.isCreation ? this.addVideo(e) : this.editVideo(e)
    },
    addVideo (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        isEmbedUrlWhitelisted(this.embedSrcAttribute).then((data) => {
          if (data.success) {
            if (data.isAllowed) {
              this.$emit('save', { contentType: 4, contentName: this.videoName, contentValue: this.embedSrcAttribute })
              this.closeModal()
            } else {
              this.urlError = this.$t('UnauthorizedUrlException')
            }
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            console.error('Error')
          }
        }, (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          console.error(err)
        })
      }
    },
    editVideo (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        isEmbedUrlWhitelisted(this.embedSrcAttribute).then((data) => {
          if (data.success) {
            if (data.isAllowed) {
              this.$emit('save', { contentType: 4, contentName: this.videoName, contentValue: this.embedSrcAttribute })
              this.closeModal()
            } else {
              this.urlError = this.$t('UnauthorizedUrlException')
            }
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            console.error('Error')
          }
        }, (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          console.error(err)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.videoWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .video-url {
    margin: 20px 0;
  }
  .video-preview {
    border: none;
    width: 100%;
    height: 300px
  }

  &.readOnly {
    .video-preview {
      border: none;
      width: 100%;
      height: 100%
    }
  }
}

.footer {
  display: flex;
  justify-content: space-around;
  .button {
    width: 150px;
  }
}
</style>

<i18n locale="fr">
{
  "creation-title": "Ajouter une video",
  "edition-title": "Modifier une video",
  "cancel": "Annuler",
  "add": "Ajouter",
  "edit": "Modifier",
  "namePlaceholder": "Titre",
  "UnauthorizedUrlException": "Ce nom de domaine n'est pas autorisé pour ce type de contenu",
  "urlPlaceholder": "Coller ici le code d'intégration de la vidéo",
  "srcRequired": "Le contenu embarqué doit comprendre un attribut \"src\" non vide",
  "embedElementCheckFailed": "Ceci n'est pas un code d'intégration valide (par exemple {embedText} )"
}
</i18n>
