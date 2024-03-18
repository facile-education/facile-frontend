<template>
  <WeprodeWindow
    :modal="true"
    data-test="embed-content-modal"
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
        v-t="ish5p? 'creation-title-h5p' : 'creation-title'"
      />
      <span
        v-else
        v-t="ish5p? 'edition-title-h5p' : 'edition-title'"
      />
    </template>

    <template #body>
      <div
        v-if="!readOnly"
        class="content-name"
      >
        <WeprodeInput
          ref="nameInput"
          v-model="contentName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="submit"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.contentName"
        />
      </div>

      <div
        v-if="!readOnly"
        class="content-url"
      >
        <WeprodeInput
          v-model="contentValue"
          :maxlength="2000"
          :placeholder="$t(ish5p ? 'urlPlaceholder-h5p' : 'urlPlaceholder')"
          @keyup.enter.stop="submit"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.embedHTMLElement || formErrorList.embedSrcAttribute || urlError"
        />
      </div>

      <a
        v-if="!readOnly && ish5p"
        v-t="'h5pUrl'"
        href="https://h5p.eduge.ch/mes-ressources-h5p"
        rel="noopener"
        target="_blank"
      />

      <iframe
        v-if="embedSrcAttribute"
        :src="embedSrcAttribute"
        title="embed content"
        class="embed-preview"
      />
    </template>

    <template
      v-if="!readOnly"
      #footer
    >
      <WeprodeButton
        v-if="isCreation"
        :label="isCreation ? $t('add') : $t('edit')"
        class="button"
        @click="submit"
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
  name: 'EmbedContentModal',
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
    },
    ish5p: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'save'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    contentName: { required },
    embedHTMLElement: { required },
    embedSrcAttribute: { required }
  },
  data () {
    return {
      contentName: '',
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
        contentName: (this.v$.contentName.$invalid && this.v$.contentName.$dirty) ? this.$t('Commons.required') : '',
        embedHTMLElement: (this.v$.embedHTMLElement.$invalid && this.v$.embedHTMLElement.$dirty) ? this.$t(this.ish5p ? 'embedElementCheckFailed-h5p' : 'embedElementCheckFailed') : '',
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
      this.contentName = this.editedContent.contentName
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
    submit () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        isEmbedUrlWhitelisted(this.embedSrcAttribute).then((data) => {
          if (data.success) {
            if (data.isAllowed) {
              this.$emit('save', { contentType: this.ish5p ? 6 : 4, contentName: this.contentName, contentValue: this.embedSrcAttribute })
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
  span {
    text-align: center;
    margin: 10px;
  }

  .content-url {
    margin: 20px 0;
  }

  .embed-preview {
    margin-top: 20px;
    border: none;
    width: 100%;
    height: 300px
  }

  .readOnly {
    .embed-preview {
      border: none;
      width: 100%;
      height: 100%
    }
  }
</style>

<i18n locale="fr">
{
  "add": "Ajouter",
  "cancel": "Annuler",
  "creation-title": "Ajouter une vidéo",
  "creation-title-h5p": "Ajouter un contenu H5P",
  "edit": "Modifier",
  "edition-title": "Modifier une video",
  "edition-title-h5p": "Editer un contenu H5P",
  "embedElementCheckFailed": "Ceci n'est pas un code d'intégration valide (par exemple {embedText} )",
  "embedElementCheckFailed-h5p": "Ce type de contenu n'est pas un contenu embarqué valide",
  "h5pUrl": "Récupérer une activité depuis h5p.eduge.ch",
  "namePlaceholder": "Titre",
  "srcRequired": "Le contenu embarqué doit comprendre un attribut \"src\" non vide",
  "UnauthorizedUrlException": "Ce nom de domaine n'est pas autorisé pour ce type de contenu",
  "urlPlaceholder": "Coller ici le code d'intégration de la vidéo",
  "urlPlaceholder-h5p": "Coller ici le code d'intégration H5P"
}
</i18n>
