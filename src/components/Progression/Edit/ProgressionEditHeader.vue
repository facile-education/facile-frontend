<template>
  <div
    class="header"
  >
    <div
      class="create-button-menu"
    >
      <PentilaButton
        class="create-button"
        @click.stop="toggleCreateMenu"
      >
        <NeroIcon
          name="fa-plus"
        />
        {{ $t('add') }}
      </PentilaButton>

      <div
        v-if="isCreateMenuDisplayed"
        id="create-menu"
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
          v-if="isFolderSelected"
          class="create-menu-item"
          @click="doCreateSubSection()"
        >
          <span>{{ $t('subSectionOf') }} {{ sectionName }}</span>
        </div>
      </div>
    </div>
    <PentilaButton
      v-if="isFolderSelected"
      class="delete-folder-button"
      @click="deleteFolder"
    >
      <img
        class="trash-icon"
        src="@assets/trash.svg"
        :alt="$t('delete')"
        :title="$t('delete')"
      >
      <span>{{ $t('delete') }}</span>
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
    }
  },
  computed: {
    isCreateMenuDisplayed () {
      return this.$store.state.progression.isCreateMenuDisplayed
    },
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
      return this.$store.state.progression.currentFolder === undefined
    },
    isFolderSelected () {
      return this.$store.state.progression.currentFolder !== undefined
    },
    sectionName () {
      // If section selected, itself
      // If sub-section selected, its parent section
      if (this.$store.state.progression.currentFolder !== undefined && this.$store.state.progression.currentFolder.parentId === 0) {
        return this.$store.state.progression.currentFolder.name
      } else if (this.$store.state.progression.currentFolder !== undefined && this.$store.state.progression.currentFolder.parentId !== 0) {
        // Parse the current progression to get the parent section
        for (let idx = 0; idx < this.$store.state.progression.currentProgression.sections.length; ++idx) {
          const section = this.$store.state.progression.currentProgression.sections[idx]
          const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(this.$store.state.progression.currentFolder.folderId)
          if (subSectionIndex !== -1) {
            return section.name
          }
        }
      }
      return ''
    }
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside (e) {
      if (this.$el.querySelector('#create-menu') && !this.$el.querySelector('#create-menu').contains(e.target)) {
        this.$store.dispatch('progression/setCreateMenuDisplayed', false)
      }
    },
    toggleCreateMenu () {
      this.$store.dispatch('progression/setCreateMenuDisplayed', !this.$store.state.progression.isCreateMenuDisplayed)
    },
    doCreateSession () {
      this.$store.dispatch('progression/addItem', { itemName: 'Contenu', isHomework: false, type: 0, order: 0 })
      this.$store.dispatch('progression/setCreateMenuDisplayed', false)
    },
    doCreateHomework () {
      this.$store.dispatch('progression/addItem', { itemName: 'Devoir', isHomework: true, type: 0, order: 0 })
      this.$store.dispatch('progression/setCreateMenuDisplayed', false)
    },
    doCreateSection () {
      this.$store.dispatch('progression/addFolder', 0)
      this.$store.dispatch('progression/setCreateMenuDisplayed', false)
    },
    doCreateSubSection () {
      const parentFolderId = (this.$store.state.progression.currentFolder.parentId === 0 ? this.$store.state.progression.currentFolder.folderId : this.$store.state.progression.currentFolder.parentId)
      this.$store.dispatch('progression/addFolder', parentFolderId)
      this.$store.dispatch('progression/setCreateMenuDisplayed', false)
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-right: 10px;

  .create-button {
    margin: auto auto auto 30px;
    border-radius: 32px;
    background-color: #306CD3;
    width: 140px;
    height: 48px;
  }

  .create-menu {
    position: relative;
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
        font-size: 0.875rem;
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
    height: 39px;
    width: 249px;
    border-radius: 6px;
    background-color: #F5F5F5;
    margin: auto 10px auto auto;
    color: black;
    display: flex;

    .trash-icon {
      width: 20px;
      height: 20px;
      margin: auto 10px auto auto;
    }

    span {
      margin: auto;
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
