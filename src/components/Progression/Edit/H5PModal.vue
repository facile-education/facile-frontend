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
      <PentilaInput
        v-model="contentValue"
        :maxlength="200"
        :placeholder="$t('urlPlaceholder')"
        class="content-url"
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
  data () {
    return {
      contentName: '',
      contentValue: ''
    }
  },
  computed: {
    isCreation () {
      return this.editedContent.contentId === undefined
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
    addH5P () {
      this.$store.dispatch('progression/addItemContent',
        { itemId: this.item.itemId, contentType: 6, contentName: this.contentName, contentValue: this.contentValue })
      this.closeModal()
    },
    editH5P () {
      this.$store.dispatch('progression/updateItemContent', { contentId: this.editedContent.contentId, contentName: this.contentName, contentValue: this.contentValue, order: this.editedContent.order })
      this.closeModal()
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
  "title": "Ajouter un contenu H5P",
  "edition-title": "Editer un contenu H5P",
  "cancel": "Annuler",
  "add": "Ajouter",
  "edit": "Modifier",
  "namePlaceholder": "Mon lien H5P",
  "urlPlaceholder": "Coller ici le lien embed H5P"
}
</i18n>
