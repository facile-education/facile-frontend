<template>
  <div
    class="header"
  >
    <div
      class="create-button-menu"
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
    </div>
    <p>Current folder : {{ currentFolderName }}</p>
    <PentilaButton
      class="delete-folder-button"
      @click="deleteFolder"
    >
      <NeroIcon
        name="fa-trash"
      />
      {{ $t('delete') }}
    </PentilaButton>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ProgressionEditHeader',
  components: { NeroIcon },
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
      console.log('currentFolder = ', this.$store.state.progression.currentFolder)
      if (this.$store.state.progression.currentFolder === undefined) {
        return []
      } else {
        return this.$store.state.progression.currentFolder.items
      }
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
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .create-button {
    margin-left: 30px;
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

  .delete-folder-button {
    width: 240px;
    height: 48px;
    margin-right: 30px;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
  "delete": "Supprimer cette section"
}
</i18n>
