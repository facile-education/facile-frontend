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

    <h3
      v-if="selectedDocuments.length === 0"
      v-t="('noDocumentSelected')"
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

      h2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .close-option {
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
}
</style>

<i18n locale="fr">
{
  "noDocumentSelected": "Aucun document sélectionné",
  "selectedDocuments": " documents sélectionnés"
}
</i18n>
