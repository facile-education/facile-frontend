<template>
  <div>
    <!-- Current folder name input -->
    <div
      v-if="isFolderSelected"
    >
      <PentilaInput
        :model-value="currentFolderName"
        :maxlength="75"
        class="folder-title"
        @blur="blurInput($event)"
      />
    </div>

    <!-- Item list -->
    <div
      v-if="itemList.length > 0"
      class="items-list"
    >
      <ProgressionItem
        v-for="item in itemList"
        :key="item.itemId"
        :item="item"
        class="item"
      >
        <h4>
          {{ item.name }}
        </h4>
      </ProgressionItem>
    </div>
    <div
      v-else-if="isEmptySection"
      class="no-item"
    >
      <div
        class="no-item-labels"
      >
        <span>{{ $t('emptySession') }}</span>
        <span>{{ $t('insertNewContent') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressionItem from '@/components/Progression/Edit/ProgressionItem'

export default {
  name: 'ProgressionEditMode',
  components: { ProgressionItem },
  data () {
    return {
      isCreateMenuDisplayed: false
    }
  },
  computed: {
    itemList () {
      if (this.$store.state.progression.currentItem !== undefined) {
        // 1 item is selected -> display it
        return [this.$store.state.progression.currentItem]
      } else if (this.$store.state.progression.currentFolder !== undefined) {
        // 1 section or sub-section is selected -> display recursively all its items
        const items = []
        if (this.$store.state.progression.currentFolder.items !== undefined && this.$store.state.progression.currentFolder.items.length > 0) {
          items.push(this.$store.state.progression.currentFolder.items)
        }
        if (this.$store.state.progression.currentFolder.subSections !== undefined && this.$store.state.progression.currentFolder.subSections.items !== undefined && this.$store.state.progression.currentFolder.subSections.items.length > 0) {
          items.push(this.$store.state.progression.currentFolder.subSections.items)
        }
        return items
      } else {
        return []
      }
    },
    currentFolderName () {
      return this.$store.state.progression.currentFolder.name
    },
    isFolderSelected () {
      return this.$store.state.progression.currentFolder !== undefined
    },
    isEmptySection () {
      // A section or sub-section is selected, it has no item and no sub-section
      return this.isFolderSelected && this.itemList.length === 0 && (this.$store.state.progression.currentFolder.subSections === undefined || this.$store.state.progression.currentFolder.subSections.length === 0)
    }
  },
  created () {
  },
  methods: {
    toggleCreateMenu () {
      this.isCreateMenuDisplayed = !this.isCreateMenuDisplayed
    },
    doCreate (type) {
      if (type === 1) {
        this.$store.dispatch('progression/addItem', { itemName: 'Contenu', isHomework: false, type: 0, order: 0 })
      } else if (type === 2) {
        this.$store.dispatch('progression/addItem', { itemName: 'Devoir', isHomework: true, type: 0, order: 0 })
      } else {
        this.$store.dispatch('progression/addFolder', { folderName: 'Dossier', order: 0 })
      }
      this.toggleCreateMenu()
    },
    deleteFolder () {
      this.$store.dispatch('progression/deleteFolder', this.$store.state.progression.currentFolder)
    },
    blurInput (e) {
      console.log('update foldername, value=', e)
      this.$store.dispatch('progression/updateFolderName', { folder: this.$store.state.progression.currentFolder, newFolderName: e.target.value })
    }
  }
}
</script>

<style lang="scss" scoped>
.folder-title {
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
}
.no-item {
  height: 400px;
  border: 1px solid #D4D4D4;
  border-radius: 6px;
  background-color: #FFFFFF;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .no-item-labels {
    margin: auto;
    display: flex;
    flex-direction: column;

    span {
      margin-top: 5px;
      text-align: center;
      margin: auto;
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
  "delete": "Supprimer cette section",
  "emptySession": "Cette section est vide",
  "insertNewContent": "Ajoutez du contenu en cliquant sur le bouton NOUVEAU"
}
</i18n>
