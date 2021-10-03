<template>
  <div>
    <!-- Create button and create menu -->
    <div
      class="header"
    >
      <PentilaButton
        class="create-button"
        @click="toggleCreateMenu"
      >
        <NeroIcon
          name="fa-plus"
        />
        {{ $t('add') }}
      </PentilaButton>
      <div
        v-if="isCreateMenuDisplayed"
        class="create-menu"
      >
        <div
          v-for="createItem in createItems"
          :key="createItem.type"
          class="create-menu-item"
        >
          <p
            @click="doCreate(createItem.type)"
          >
            {{ createItem.name }}
          </p>
        </div>
      </div>
      <PentilaButton
        class="delete-folder-button"
        @click="deleteFolder"
      >
        <NeroIcon
          name="fa-trash"
        />
        {{ $t('delete') }}
      </PentilaButton>
      <p>Current folder : {{ currentFolderName }}</p>
    </div>

    <div class="items-list">
      <ProgressionItem
        v-for="item in itemList"
        :key="item.itemId"
        class="item"
      >
        <h4>
          {{ item.name }}
        </h4>
      </ProgressionItem>
    </div>
  </div>
</template>

<script>
import ProgressionItem from '@/components/Progression/Edit/ProgressionItem'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ProgressionEditMode',
  components: { ProgressionItem, NeroIcon },
  data () {
    return {
      isCreateMenuDisplayed: false,
      createItems: [
        { type: 1, name: 'Contenu de séance' },
        { type: 2, name: 'Devoir' },
        { type: 3, name: 'Section' }
      ]
    }
  },
  computed: {
    itemList () {
      return this.$store.state.progression.currentProgression.items
    },
    currentFolderName () {
      if (this.$store.state.progression.currentFolder === undefined) {
        return 'root'
      } else {
        return this.$store.state.progression.currentFolder.name
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  .create-button {
    margin-left: 30px;
    margin-top: 10px;
    width: 140px;
    height: 48px;
  }
  .create-menu {
    border: 1px solid black;
    margin-left: 30px;
    width: 200px;
    .create-menu-item {
      height: 30px;
      &:hover {
        background: rgb(167, 167, 247);
        cursor: pointer;
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
  "delete": "Supprimer cette section"
}
</i18n>
