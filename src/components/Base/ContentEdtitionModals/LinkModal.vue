<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="linkWindow"
    :width="600"
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
      <div class="link-name">
        <WeprodeInput
          ref="nameInput"
          v-model="linkName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.linkName"
        />
      </div>
      <div class="link-url">
        <WeprodeInput
          v-model="linkUrl"
          :maxlength="250"
          :placeholder="$t('urlPlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <WeprodeErrorMessage
          :error-message="formErrorList.linkUrl || urlError"
        />
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        data-test="addLinkButton"
        @click="addLink"
      />
      <WeprodeButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editLink"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { isValidUrl } from '@/api/course.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'LinkModal',
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
    }
  },
  emits: ['close', 'save'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    linkName: { required },
    linkUrl: { required }
  },
  data () {
    return {
      linkName: '',
      linkUrl: '',
      urlError: ''
    }
  },
  computed: {
    isCreation () {
      return this.editedContent.contentId === undefined
    },
    formErrorList () {
      return {
        linkName: (this.v$.linkName.$invalid && this.v$.linkName.$dirty) ? this.$t('Commons.required') : '',
        linkUrl: (this.v$.linkUrl.$invalid && this.v$.linkUrl.$dirty) ? this.$t('Commons.required') : ''
      }
    }
  },
  watch: {
    linkUrl () {
      this.urlError = '' // Reset URL error when url change
    }
  },
  mounted () {
    if (!this.isCreation) {
      this.linkName = this.editedContent.contentName
      this.linkUrl = this.editedContent.contentValue
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
      this.isCreation ? this.addLink(e) : this.editLink(e)
    },
    addLink (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        isValidUrl(this.linkUrl).then((data) => {
          if (data.success) {
            if (data.isValid) {
              this.$emit('save', { contentType: 3, contentName: this.linkName, contentValue: this.linkUrl })
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
    editLink (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        isValidUrl(this.linkUrl).then((data) => {
          if (data.success) {
            if (data.isValid) {
              this.$emit('save', { contentType: 3, contentName: this.linkName, contentValue: this.linkUrl })
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
.linkWindow {
  span {
    text-align: center;
    margin: 10px;
  }
  .link-url {
    margin: 20px 0;
  }
}
</style>

<i18n locale="fr">
{
  "creation-title": "Ajouter un lien",
  "edition-title": "Modifier un lien",
  "cancel": "Annuler",
  "add": "Ajouter",
  "edit": "Modifier",
  "namePlaceholder": "Titre",
  "urlPlaceholder": "https://www.monlien.com",
  "UnauthorizedUrlException": "Url non valide"
}
</i18n>
