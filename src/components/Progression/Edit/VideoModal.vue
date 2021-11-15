<template>
  <PentilaWindow
    :modal="true"
    class="videoWindow"
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
      <div class="video-name">
        <PentilaInput
          ref="nameInput"
          v-model="videoName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.videoName"
        />
      </div>
      <div class="video-url">
        <PentilaInput
          v-model="videoUrl"
          :maxlength="200"
          :placeholder="$t('urlPlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.videoUrl || urlError"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        v-if="isCreation"
        :label="$t('add')"
        class="button create-button"
        @click="addVideo"
      />
      <PentilaButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editVideo"
      />
    </template>
  </PentilaWindow>
</template>

<script>

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'VideoModal',
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
    videoName: { required },
    videoUrl: { required }
  },
  data () {
    return {
      videoName: '',
      videoUrl: '',
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
        videoUrl: (this.v$.videoUrl.$invalid && this.v$.videoUrl.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  mounted () {
    if (!this.isCreation) {
      this.videoName = this.editedContent.contentName
      this.videoUrl = this.editedContent.contentValue
    }

    // Focus form
    const input = this.$refs.nameInput
    input.focus()
    input.select()
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
        this.$store.dispatch('progression/addItemContent', { itemId: this.item.itemId, contentType: 4, contentName: this.videoName, contentValue: this.videoUrl })
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
    editVideo (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('progression/updateItemContent', {
          contentId: this.editedContent.contentId,
          contentName: this.videoName,
          contentValue: this.videoUrl,
          order: this.editedContent.order
        })
          .then(() => {
            this.closeModal()
          })
          .catch((error) => {
            if (error === 'UnauthorizedUrlException') {
              this.urlError = this.$t('UnauthorizedUrlException')
            } else {
              // TODO popup error "Une erreur est survenue lors de la mise à jour du contenu"
              this.closeModal()
            }
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
  "urlPlaceholder": "https://www.youtube.com/watch?v=C_uNmmgQliM"
}
</i18n>
