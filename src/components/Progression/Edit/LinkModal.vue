<template>
  <PentilaWindow
    :modal="true"
    class="linkWindow"
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
        v-model="linkName"
        :maxlength="200"
        :placeholder="$t('namePlaceholder')"
        class="link-name"
      />
      <PentilaErrorMessage
        class="volee-error"
        :error-message="formErrorList.linkName"
      />
      <PentilaInput
        v-model="linkUrl"
        :maxlength="200"
        :placeholder="$t('urlPlaceholder')"
        class="link-url"
      />
      <PentilaErrorMessage
        class="volee-error"
        :error-message="formErrorList.linkUrl"
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
          @click="addLink"
        />
        <PentilaButton
          v-else
          :label="$t('edit')"
          class="button"
          @click="editLink"
        />
      </div>
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
  .link-url, .link-name {
    margin: 10px;
    margin-right: 20px;
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
  "creation-title": "Ajouter un lien",
  "edition-title": "Modifier un lien",
  "cancel": "Annuler",
  "add": "Ajouter",
  "edit": "Modifier",
  "namePlaceholder": "Mon lien",
  "urlPlaceholder": "https://wwww.monlien.com"
}
</i18n>
