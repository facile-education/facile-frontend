<template>
  <div
    v-if="!displayGroupDetails"
    class="details-panel"
    data-test="details-panel"
  >
    <header>
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
        v-t="('Documents.DocumentDetails.noDocumentSelected')"
        class="document-name"
      />
      <h3
        v-else
        class="document-name"
      >
        {{ selectedDocuments.length + ' ' + $t('Documents.DocumentDetails.selectedDocuments') }}
      </h3>
      <button
        class="close-option"
        :aria-label="$t('Documents.DocumentDetails.close')"
        :title="$t('Documents.DocumentDetails.close')"
        @click="closePanel"
      >
        <CustomIcon
          icon-name="icon-cross-L"
          class="icon"
        />
      </button>
    </header>

    <DocumentMetaData
      v-if="selectedDocuments.length === 1"
      :document="documentToDisplay"
    />

    <DocumentVersionsList
      v-if="selectedDocuments.length === 1 && documentToDisplay.type === 'File'"
      :document="documentToDisplay"
      @view-count="updateDocumentViewCount"
      @download-count="updateDocumentDownloadCount"
    />

    <p
      v-if="selectedDocuments.length === 0"
      v-t="('Documents.DocumentDetails.noData')"
      class="placeholder"
    />
  </div>
  <GroupDetails v-else />
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import DocumentMetaData from '@components/Documents/DocumentDetails/DocumentMetaData'
import DocumentVersionsList from '@components/Documents/DocumentDetails/DocumentVersionsList'
import { defineAsyncComponent } from 'vue'
const GroupDetails = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetails'))

export default {
  name: 'DocumentDetails',
  components: { CustomIcon, GroupDetails, DocumentVersionsList, DocumentMetaData },
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
  display: flex;
  flex-direction: column;

  header {
    display: flex;
    align-items: center;
    height: 60px;

    .document-name {
      flex: 1;
      padding-left: 10px;
      max-width: 290px;
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

      .icon {
        font-size: 1.25rem;
        font-weight: bold;
      }
    }
  }

  .placeholder {
    margin-left: 10px;
  }
}
</style>
