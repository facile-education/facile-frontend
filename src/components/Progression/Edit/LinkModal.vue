<template>
  <PentilaWindow
    :modal="true"
    class="linkWindow"
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
      <div class="link-name">
        <PentilaInput
          v-model="linkName"
          :maxlength="200"
          :placeholder="$t('namePlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.linkName"
        />
      </div>
      <div class="link-url">
        <PentilaInput
          v-model="linkUrl"
          :maxlength="200"
          :placeholder="$t('urlPlaceholder')"
          @keyup.enter.stop="pressEnter"
        />
        <PentilaErrorMessage
          :error-message="formErrorList.linkUrl"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        v-if="isCreation"
        :label="$t('add')"
        class="button"
        @click="addLink"
      />
      <PentilaButton
        v-else
        :label="$t('edit')"
        class="button"
        @click="editLink"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export default {
  name: 'LinkModal',
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
    linkName: { required },
    linkUrl: { required }
  },
  data () {
    return {
      linkName: '',
      linkUrl: ''
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
  mounted () {
    if (!this.isCreation) {
      this.linkName = this.editedContent.contentName
      this.linkUrl = this.editedContent.contentValue
    }
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
        this.$store.dispatch('progression/addItemContent',
          { itemId: this.item.itemId, contentType: 3, contentName: this.linkName, contentValue: this.linkUrl })
        this.closeModal()
      }
    },
    editLink (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.$store.dispatch('progression/updateItemContent', {
          contentId: this.editedContent.contentId,
          contentName: this.linkName,
          contentValue: this.linkUrl,
          order: this.editedContent.order
        })
        this.closeModal()
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
  "urlPlaceholder": "https://www.monlien.com"
}
</i18n>
