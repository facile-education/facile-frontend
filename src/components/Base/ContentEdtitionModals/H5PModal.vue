<template>
  <WeprodeWindow
    :modal="true"
    class="h5pWindow"
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
        class="content-name"
      >
        <WeprodeInput
          ref="nameInput"
          v-model="contentName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="pressEnter"
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
          :placeholder="$t('urlPlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.embedHTMLElement || formErrorList.embedSrcAttribute || urlError"
        />
      </div>

      <a
        v-if="!readOnly"
        v-t="'h5pUrl'"
        href="https://h5p.eduge.ch/mes-ressources-h5p"
        target="_blank"
      />

      <iframe
        v-if="embedSrcAttribute"
        :src="embedSrcAttribute"
        class="h5p-preview"
      />
    </template>

    <template
      v-if="!readOnly"
      #footer
    >
      <WeprodeButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        @click="addH5P"
      />
      <WeprodeButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editH5P"
      />
    </template>
  </WeprodeWindow>
</template>

<script>

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'H5PModal',
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
        embedHTMLElement: (this.v$.embedHTMLElement.$invalid && this.v$.embedHTMLElement.$dirty) ? this.$t('embedElementCheckFailed') : '',
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
    pressEnter (e) {
      this.isCreation ? this.addH5P(e) : this.editH5P(e)
    },
    addH5P (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else if (this.item !== undefined) {
        this.$store.dispatch('progression/addItemContent',
          { itemId: this.item.itemId, contentType: 6, contentName: this.contentName, contentValue: this.embedSrcAttribute })
          .then(() => {
            this.closeModal()
          })
          .catch((error) => {
            if (error === 'UnauthorizedUrlException') {
              this.urlError = this.$t('UnauthorizedUrlException')
            } else {
              // TODO popup error "Une erreur est survenue lors de l'ajout du contenu"
              this.closeModal()
            }
          })
      } else {
        this.$emit('save', { contentType: 6, contentName: this.contentName, contentValue: this.embedSrcAttribute })
        this.closeModal()
      }
    },
    editH5P (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else if (this.item !== undefined) {
        this.$store.dispatch('progression/updateItemContent', {
          contentId: this.editedContent.contentId,
          contentName: this.contentName,
          contentValue: this.embedSrcAttribute,
          order: this.editedContent.order
        })
          .then(() => {
            this.closeModal()
          })
          .catch((error) => {
            if (error === 'UnauthorizedUrlException') {
              this.urlError = this.$t('UnauthorizedUrlException')
            } else {
              // TODO popup error "Une erreur est survenue lors de l'ajout du contenu"
              this.closeModal()
            }
          })
      } else {
        this.$emit('save', { contentType: 6, contentName: this.contentName, contentValue: this.embedSrcAttribute })
        this.closeModal()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.h5pWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .content-url {
    margin: 20px 0;
  }
  .h5p-preview {
    margin-top: 20px;
    border: none;
    width: 100%;
    height: 300px
  }

  &.readOnly {
    .h5p-preview {
      border: none;
      width: 100%;
      height: 100%
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "Ajouter",
  "cancel": "Annuler",
  "creation-title": "Ajouter un contenu H5P",
  "edit": "Modifier",
  "edition-title": "Editer un contenu H5P",
  "embedElementCheckFailed": "Ce type de contenu n'est pas un contenu embarqué valide",
  "h5pUrl": "Récupérer une activité depuis h5p.eduge.ch",
  "namePlaceholder": "Titre",
  "srcRequired": "Le contenu embarqué doit comprendre un attribut \"src\" non vide",
  "UnauthorizedUrlException": "Ce nom de domaine n'est pas autorisé pour ce type de contenu",
  "urlPlaceholder": "Coller ici le code d'intégration H5P"
}
</i18n>
