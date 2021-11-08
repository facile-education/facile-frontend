<template>
  <PentilaWindow
    :modal="true"
    class="videoWindow"
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
        v-model="videoName"
        :maxlength="200"
        :placeholder="$t('namePlaceholder')"
        class="video-name"
      />
      <PentilaErrorMessage
        class="volee-error"
        :error-message="formErrorList.videoName"
      />
      <PentilaInput
        v-model="videoUrl"
        :maxlength="200"
        :placeholder="$t('urlPlaceholder')"
        class="video-url"
      />
      <PentilaErrorMessage
        class="volee-error"
        :error-message="formErrorList.videoUrl"
      />
    </template>

    <template #footer>
      <div
        class="footer"
      >
        <PentilaButton
          :label="$t('cancel')"
          class="button cancel-button"
          @click="closeModal"
        />
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
      </div>
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
      videoUrl: ''
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
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    addVideo (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('progression/addItemContent',
          { itemId: this.item.itemId, contentType: 4, contentName: this.videoName, contentValue: this.videoUrl })
        this.closeModal()
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
        this.closeModal()
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
  .video-url, .video-name {
    margin: 10px;
    margin-right: 30px;
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
  "namePlaceholder": "Ma video",
  "urlPlaceholder": "https://www.youtube.com/watch?v=C_uNmmgQliM"
}
</i18n>
