<template>
  <div class="details-panel">
    <div class="header">
      <div
        v-if="selectedDocuments.length === 1"
        class="document-name"
        :title="documentToDisplay.name"
      >
        <h2>
          {{ documentToDisplay.name }}
        </h2>
      </div>
      <h3
        v-else-if="selectedDocuments.length === 0"
        v-t="('noDocumentSelected')"
        class="document-name"
      />
      <h3
        v-else
        class="document-name"
      >
        {{ selectedDocuments.length + '  ' + $t('selectedDocuments') }}
      </h3>
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

    <DocumentMetaData
      v-if="selectedDocuments.length === 1"
      :document="documentToDisplay"
    />

    <DocumentVersionsList
      v-if="selectedDocuments.length === 1 && documentToDisplay.type === 'File'"
      :document="documentToDisplay"
    />

    <p
      v-if="selectedDocuments.length === 0"
      v-t="('noData')"
      class="placeholder"
    />
    <p
      v-else-if="selectedDocuments.length > 1"
      v-t="('tooManyData')"
      class="placeholder"
    />
  </div>
</template>

<script>
import DocumentMetaData from '@components/Documents/DocumentDetails/DocumentMetaData'
import DocumentVersionsList from '@components/Documents/DocumentDetails/DocumentVersionsList'
export default {
  name: 'DocumentDetails',
  components: { DocumentVersionsList, DocumentMetaData },
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
@import "@design";

.details-panel {
  background-color: $color-not-white-bg;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;

  .header {
    display: flex;
    align-items: center;
    height: 60px;

    .document-name {
      flex: 1;
      padding-left: 10px;
      max-width: 290px;

      h2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .close-option {
      margin-left: auto;
      height: 100%;
      width: 40px;
      display: flex;
      cursor: pointer;
      align-items: center;
      justify-content: center;

      img {
        width: 16px;
        height: 16px;
      }
    }
  }

  .placeholder {
    margin-left: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "noData": "Il n'y a aucune information à afficher",
  "noDocumentSelected": "Aucun document sélectionné",
  "selectedDocuments": " documents sélectionnés",
  "tooManyData": "Il y a trop de documents sélectionnés"
}
</i18n>
