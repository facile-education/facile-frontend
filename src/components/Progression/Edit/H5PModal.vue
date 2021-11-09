<template>
  <PentilaWindow
    :modal="true"
    class="h5pWindow"
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
      <PentilaInput
        v-model="contentName"
        :maxlength="200"
        :placeholder="$t('namePlaceholder')"
        class="content-name"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.contentName"
      />
      <PentilaInput
        v-model="contentValue"
        :maxlength="200"
        :placeholder="$t('urlPlaceholder')"
        class="content-url"
      />
      <PentilaErrorMessage
        :error-message="formErrorList.contentValue || urlError"
      />
    </template>

    <template #footer>
      <div
        class="footer"
      >
        <PentilaButton
          :label="$t('cancel')"
          class="button"
          @click="closeModal"
        />
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
      </div>
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
    contentValue: { required }
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
        contentValue: (this.v$.contentValue.$invalid && this.v$.contentValue.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  mounted () {
    if (!this.isCreation) {
      this.contentName = this.editedContent.contentName
      this.contentValue = this.editedContent.contentValue
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    addH5P (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('progression/addItemContent',
          { itemId: this.item.itemId, contentType: 6, contentName: this.contentName, contentValue: this.contentValue })
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
          contentValue: this.contentValue,
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
  .content-url, .content-name {
    margin: 10px 20px 10px 10px;
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
  "creation-title": "Ajouter un contenu H5P",
  "edition-title": "Editer un contenu H5P",
  "cancel": "Annuler",
  "add": "Ajouter",
  "edit": "Modifier",
  "namePlaceholder": "Mon lien H5P",
  "UnauthorizedUrlException": "Ce nom de domaine n'est pas autorisé pour ce type de contenu",
  "urlPlaceholder": "Coller ici le lien embed H5P"
}
</i18n>
