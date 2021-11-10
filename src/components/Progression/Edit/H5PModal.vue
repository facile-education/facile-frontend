<template>
  <PentilaWindow
    :modal="true"
    class="h5pWindow"
    win-width="600px"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span
        v-if="isCreation"
        v-t="'creation-title'"
      />
      <span
        v-else
        v-t="'edition-title'"
      />
    </template>

    <template #body>
      <div class="content-name">
        <PentilaInput
          v-model="contentName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.contentName"
        />
      </div>
      <div class="content-url">
        <PentilaInput
          v-model="contentValue"
          :maxlength="200"
          :placeholder="$t('urlPlaceholder')"
          @keyup.enter="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.embedHTMLElement || formErrorList.embedSrcAttribute || urlError"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        @click="addH5P"
      />
      <PentilaButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editH5P"
      />
    </template>
  </PentilaWindow>
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
      required: true
    },
    editedContent: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
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
      } else {
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
      }
    },
    editH5P (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
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
}
</style>

<i18n locale="fr">
{
  "creation-title": "Ajouter un contenu H5P",
  "edition-title": "Editer un contenu H5P",
  "embedElementCheckFailed": "Ce type de contenu n'est pas un contenu embarqué valide",
  "srcRequired": "Le contenu embarqué doit comprendre un attribut \"src\" non vide",
  "cancel": "Annuler",
  "add": "Ajouter",
  "edit": "Modifier",
  "namePlaceholder": "Titre",
  "UnauthorizedUrlException": "Ce nom de domaine n'est pas autorisé pour ce type de contenu",
  "urlPlaceholder": "Coller ici le lien embed H5P"
}
</i18n>
