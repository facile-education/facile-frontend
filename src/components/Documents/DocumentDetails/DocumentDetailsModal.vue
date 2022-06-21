<template>
  <PentilaWindow
    class="details-display-modal"
    :modal="true"
    :is-full-screen="true"
    @close="onClose"
  >
    <template #header>
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
    </template>

    <template #body>
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
    </template>

    <template #footer />
  </PentilaWindow>
</template>

<script>
import DocumentMetaData from '@components/Documents/DocumentDetails/DocumentMetaData'
import DocumentVersionsList from '@components/Documents/DocumentDetails/DocumentVersionsList'
export default {
  name: 'DocumentDetailsModal',
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
      height: 100%;
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
.modal {
  height: 100%;

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
}

</style>
