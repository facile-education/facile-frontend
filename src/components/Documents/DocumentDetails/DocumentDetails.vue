<template>
  <div
    v-if="!displayGroupDetails"
    class="details-panel"
  >
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
      <button
        class="close-option"
        @click="closePanel"
      >
        <img
          src="@assets/options/icon_cross_black.svg"
          alt="close"
        >
      </button>
    </div>

    <DocumentMetaData
      v-if="selectedDocuments.length === 1"
      :document="documentToDisplay"
    />

    <DocumentVersionsList
      v-if="selectedDocuments.length === 1 && documentToDisplay.type === 'File'"
      :document="documentToDisplay"
      @viewCount="updateDocumentViewCount"
      @downloadCount="updateDocumentDownloadCount"
    />

    <p
      v-if="selectedDocuments.length === 0"
      v-t="('noData')"
      class="placeholder"
    />
  </div>
  <GroupDetails v-else />
</template>

<script>
import DocumentMetaData from '@components/Documents/DocumentDetails/DocumentMetaData'
import DocumentVersionsList from '@components/Documents/DocumentDetails/DocumentVersionsList'
import { defineAsyncComponent } from 'vue'
const GroupDetails = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetails'))

export default {
  name: 'DocumentDetails',
  components: { GroupDetails, DocumentVersionsList, DocumentMetaData },
  computed: {
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
    },
    documentToDisplay () {
      if (this.selectedDocuments.length === 1) {
        return { ...this.selectedDocuments[0] }
      } else {
        return undefined
      }
    },
    displayGroupDetails () {
      return !!(this.documentToDisplay && this.documentToDisplay.isGroupRootFolder)
    }
  },
  methods: {
    updateDocumentViewCount (viewCount) {
      this.documentToDisplay.viewCount = viewCount
    },
    updateDocumentDownloadCount (downloadCount) {
      this.documentToDisplay.downloadCount = downloadCount
    },
    closePanel () {
      this.$store.dispatch('documents/closeDocumentPanel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.details-panel {
  border-left: 1px solid $color-border;
  height: 100%;

  .header {
    display: flex;
    align-items: center;
    height: 60px;

    .document-name {
      flex: 1;
      padding-left: 10px;
      max-width: 290px;
      font-family: Roboto-Medium, sans-serif;
      font-size: 19px;
      color: #000000;

      h2 {
        line-height: 1.5em;
        font-size: 19px;
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
      background: none;
      border: none;

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
  "selectedDocuments": " documents sélectionnés"
}
</i18n>
