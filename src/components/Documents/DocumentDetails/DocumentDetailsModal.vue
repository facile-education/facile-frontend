<template>
  <PentilaWindow
    v-if="!displayGroupDetails"
    class="details-display-modal"
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

    <template #footer />
  </PentilaWindow>
  <GroupDetailsModal v-else />
</template>

<script>
import DocumentMetaData from '@components/Documents/DocumentDetails/DocumentMetaData'
import DocumentVersionsList from '@components/Documents/DocumentDetails/DocumentVersionsList'
import { defineAsyncComponent } from 'vue'
const GroupDetailsModal = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/GroupDetailsModal'))

export default {
  name: 'DocumentDetailsModal',
  components: { GroupDetailsModal, DocumentVersionsList, DocumentMetaData },
  computed: {
    computedHeader () {
      if (this.selectedDocuments.length === 1) {
        return this.documentToDisplay.name
      } else if (this.selectedDocuments.length === 0) {
        return this.$t('noDocumentSelected')
      } else {
        return this.selectedDocuments.length + '  ' + this.$t('selectedDocuments')
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

<i18n locale="fr">
{
  "noData": "Il n'y a aucune information à afficher",
  "noDocumentSelected": "Aucun document sélectionné",
  "selectedDocuments": " documents sélectionnés"
}
</i18n>
