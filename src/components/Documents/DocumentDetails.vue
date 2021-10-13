<template>
  <div class="details-panel">
    <div class="header">
      <div
        v-if="selectedDocuments.length === 1"
        class="document-name"
      >
        {{ documentToDisplay.name }}
      </div>
      <div
        class="close-option"
        @click="closePanel"
      >
        <img
          src="@assets/options/icon_cross_black.svg"
          alt="close"
        >
      </div>
    </div>
    <h3
      v-if="selectedDocuments.length === 0"
      v-t="('noDocumentSelected')"
    />
    <h3
      v-else-if="selectedDocuments.length === 1"
      v-t="('noDocumentSelected')"
    />
    <h3> {{ selectedDocuments.length + $t('selectedDocuments') }}</h3>
  </div>
</template>

<script>
export default {
  name: 'DocumentDetails',
  computed: {
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
    },
    documentToDisplay () {
      if (this.selectedDocuments.length === 1) {
        return this.selectedDocuments[0]
      } else {
        return undefined
      }
    }
  },
  methods: {
    closePanel () {
      this.$store.dispatch('documents/closeDocumentPanel')
    }
  }
}
</script>

<style lang="scss" scoped>
.details-panel {
  .header {
    display: flex;
    align-items: center;
    height: 50px;

    .document-name {
      flex: 1;
    }

    .close-option {
      cursor: pointer;
      align-items: center;

      img {
        width: 33px;
        height: 33px;
      }
    }
  }

  h3 {

  }
}
</style>

<i18n locale="fr">
{
  "noDocumentSelected": "Aucun document sélectionné",
  "selectedDocuments": " documents sélectionnés"
}
</i18n>
