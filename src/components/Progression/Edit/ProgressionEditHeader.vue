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
        <!-- Create session content -->
        <div
          v-if="!isRootFolderSelected"
          class="create-menu-item"
          @click="doCreateSession()"
        >
          <img
            class="create-menu-icon"
            src="@assets/seance.svg"
            :alt="$t('sessionContent')"
            :title="$t('sessionContent')"
          >
          <span>{{ $t('sessionContent') }}</span>
        </div>

        <!-- Create homework -->
        <div
          v-if="!isRootFolderSelected"
          class="create-menu-item"
          @click="doCreateHomework()"
        >
          <img
            class="create-menu-icon"
            src="@assets/devoir.svg"
            :alt="$t('homework')"
            :title="$t('homework')"
          >
          <span>{{ $t('homework') }}</span>
        </div>

        <hr
          v-if="!isRootFolderSelected"
        >

        <!-- Create section -->
        <div
          class="create-menu-item"
          @click="doCreateSection()"
        >
          <span>{{ $t('section') }}</span>
        </div>

        <!-- Create sub-section -->
        <div
          v-if="isSectionSelected"
          class="create-menu-item"
          @click="doCreateSubSection()"
        >
          <span>{{ $t('subSectionOf') }} {{ selectedFolderName }}</span>
        </div>
      </div>
    </div>
    <PentilaButton
      v-if="isFolderSelected"
      class="delete-folder-button"
      @click="deleteFolder"
    >
      <NeroIcon
        name="fa-trash"
        class="trash-icon"
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
      isCreateMenuDisplayed: false
    }
  },
  computed: {
    itemList () {
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
    },
    isRootFolderSelected () {
      console.log('isRootFolderSelected currentFolder=', this.$store.state.progression.currentFolder)
      return this.$store.state.progression.currentFolder === undefined
    },
    isSectionSelected () {
      return this.$store.state.progression.currentFolder !== undefined && this.$store.state.progression.currentFolder.parentId === 0
    },
    isFolderSelected () {
      return this.$store.state.progression.currentFolder !== undefined
    },
    selectedFolderName () {
      if (this.$store.state.progression.currentFolder !== undefined && this.$store.state.progression.currentFolder.parentId === 0) {
        return this.$store.state.progression.currentFolder.name
      }
      return ''
    }
  },
  created () {
  },
  methods: {
    toggleCreateMenu () {
      this.isCreateMenuDisplayed = !this.isCreateMenuDisplayed
    },
    doCreateSession () {
      this.$store.dispatch('progression/addItem', { itemName: 'Contenu', isHomework: false, type: 0, order: 0 })
      this.toggleCreateMenu()
    },
    doCreateHomework () {
      this.$store.dispatch('progression/addItem', { itemName: 'Devoir', isHomework: true, type: 0, order: 0 })
      this.toggleCreateMenu()
    },
    doCreateSection () {
      this.$store.dispatch('progression/addFolder')
      this.toggleCreateMenu()
    },
    doCreateSubSection () {
      this.$store.dispatch('progression/addFolder')
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
    margin: auto;
    margin-left: 30px;
    border-radius: 32px;
    background-color: #306CD3;
    width: 140px;
    height: 48px;
  }
  .create-menu {
    margin-left: 30px;
    width: 250px;
    z-index: 10;
    border: 1px solid #F4F4F4;
    border-radius: 6px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 14px 0 rgba(0,0,0,0.08);

    .create-menu-item {
      height: 30px;
      width: 90%;
      margin-left: 10px;
      margin-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      z-index: 100;
      background: white;
      display: inline-block;
      &:hover {
        background-color: #EFF3FB;
        cursor: pointer;
      }
      .create-menu-icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }
      span {
        margin-left: 10px;
        height: 100%;
        color: #000000;
        font-family: Roboto;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 16px;
      }
    }
    hr {
      margin-top: 5px;
      margin-bottom: 5px;
      border: 0; border-top: 1px solid #D4D4D4;
    }

  }

  .delete-folder-button {
    margin: auto;
    height: 39px;
    width: 249px;
    border-radius: 6px;
    background-color: #F5F5F5;
    margin-right: 30px;
    color: black;
    .trash-icon {
      margin-right: 10px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "delete": "Supprimer cette section",
  "sessionContent": "CONTENU DE SEANCE",
  "homework": "DEVOIR",
  "section": "SECTION",
  "subSectionOf": "SOUS-SECTION DE "
}
</i18n>
