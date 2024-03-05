<template>
  <WeprodeWindow
    v-if="!displayGroupDetails"
    class="details-display-modal"
    data-test="details-panel"
    :modal="true"
    :full-screen="true"
    @close="onClose"
  >
    <template #header>
      <span
        :title="computedHeader"
        class="title"
      >
        {{ computedHeader }}
      </span>
    </template>

    <template #body>
      <div class="body">
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
          v-t="('Documents.DocumentDetailsModal.noData')"
          class="placeholder"
        />
        <p
          v-else-if="selectedDocuments.length > 1"
          v-t="('tooManyData')"
          class="placeholder"
        />
      </div>
    </template>

    <template #footer />
  </WeprodeWindow>
  <GroupDetailsModal v-else />
</template>

<script>
import DocumentMetaData from '@components/Documents/DocumentDetails/DocumentMetaData'
import DocumentVersionsList from '@components/Documents/DocumentDetails/DocumentVersionsList'
import { defineAsyncComponent } from 'vue'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
const GroupDetailsModal = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetailsModal'))

export default {
  name: 'DocumentDetailsModal',
  components: { GroupDetailsModal, DocumentVersionsList, DocumentMetaData, WeprodeWindow },
  computed: {
    computedHeader () {
      if (this.selectedDocuments.length === 1) {
        return this.documentToDisplay.name
      } else if (this.selectedDocuments.length === 0) {
        return this.$t('Documents.DocumentDetailsModal.noDocumentSelected')
      } else {
        return this.$t('Documents.DocumentDetailsModal.selectedDocuments', { n: selectedDocuments.length })
      }
    },
    selectedDocuments () {
      return this.$store.state.documents.selectedEntities
    },
    documentToDisplay () {
      if (this.selectedDocuments.length === 1) {
        return this.selectedDocuments[0]
      } else {
        return undefined
      }
    },
    displayGroupDetails () {
      return !!(this.documentToDisplay && this.documentToDisplay.isGroupRootFolder)
    }
  },
  methods: {
    onClose () {
      this.$store.dispatch('documents/closeDocumentPanel')
    }
  }
}
</script>
<style lang="scss">
.details-display-modal {
  .window-wrapper.full-screen {
    .window-container {
      height: 100vh;
      width: 100vw;
      .window-header {
        width: 100%;
        border-bottom: none;
      }

      .window-body {
        padding: 0;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.details-display-modal {
  height: 100%;

  .title {
    display: block;
    max-width: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .body {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

</style>
