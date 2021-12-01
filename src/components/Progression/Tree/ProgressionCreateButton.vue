<template>
  <div class="create-button-menu">
    <PentilaButton
      class="create-button"
      @click.stop="toggleCreateMenu"
    >
      <NeroIcon
        class="add-icon"
        name="fa-plus"
      />
      <span v-t="'add'" />
    </PentilaButton>

    <div
      v-if="isCreateMenuDisplayed"
      id="create-menu"
      data-test="create-menu"
      class="create-menu"
    >
      <!-- Create session content -->
      <div
        v-if="isItemCreationAllowed"
        class="create-menu-item"
        @click="doCreateSession"
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
        v-if="isItemCreationAllowed"
        class="create-menu-item"
        @click="doCreateHomework"
      >
        <img
          class="create-menu-icon"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <span>{{ $t('homework') }}</span>
      </div>

      <hr v-if="isItemCreationAllowed">

      <!-- Create section -->
      <div
        class="create-menu-item"
        @click="doCreateSection"
      >
        <span>{{ $t('section') }}</span>
      </div>

      <!-- Create sub-section -->
      <div
        v-if="sectionName !== ''"
        class="create-menu-item"
        :title="$t('subSectionOf') + sectionName"
        @click="doCreateSubSection"
      >
        <span>{{ $t('subSectionOf') + sectionName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import NeroIcon from '@components/Nero/NeroIcon'
import { helperMethods } from '@store/modules/progression.store'

export default {
  name: 'ProgressionCreateButton',
  components: { NeroIcon },
  computed: {
    isItemCreationAllowed () {
      return this.currentFolder || this.currentItem
    },
    isCreateMenuDisplayed () {
      return this.$store.state.progression.isCreateMenuDisplayed
    },
    itemList () {
      if (this.currentFolder === undefined) {
        return []
      } else {
        return this.currentFolder.items
      }
    },
    currentFolderName () {
      if (this.currentFolder === undefined) {
        return 'root'
      } else {
        return this.currentFolder.name
      }
    },
    currentProgressionSections () {
      return this.$store.state.progression.currentProgression.sections
    },
    currentFolder () {
      return this.$store.state.progression.currentFolder
    },
    currentItem () {
      return this.$store.state.progression.currentItem
    },
    isFolderSelected () {
      return this.currentFolder !== undefined
    },
    sectionName () {
      // If section selected, itself
      // If sub-section selected, its parent section
      const currentFolder = this.currentItem ? this.$store.getters['progression/getItemFolder'](this.currentItem) : this.currentFolder
      if (currentFolder !== undefined && currentFolder.parentId === 0) {
        return currentFolder.name
      } else if (currentFolder !== undefined && currentFolder.parentId !== 0) {
        // Parse the current progression to get the parent section
        for (let idx = 0; idx < this.currentProgressionSections.length; ++idx) {
          const section = this.currentProgressionSections[idx]
          const subSectionIndex = section.subSections.map(subSection => subSection.folderId).indexOf(currentFolder.folderId)
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
    getItemFolder (item) {
      console.log(item.name)
      this.currentProgressionSections.forEach((section) => {
        console.log('section', section.name)
        // console.log(section.subSections)
        if (section.folderId === item.folderId) {
          console.log('return section')
          return section
        } else {
          section.subSections.forEach((subSection) => {
            console.log('subSection', subSection.name)
            if (subSection.folderId === item.folderId) {
              console.log('return subsection')
              return subSection
            }
          })
        }
      })
      return undefined
    },
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
      let parentFolderId
      if (this.currentFolder) {
        parentFolderId = (this.currentFolder.parentId === 0 ? this.currentFolder.folderId : this.currentFolder.parentId)
      } else if (this.currentItem) {
        parentFolderId = this.currentItem.folderId
        const parentFolder = helperMethods.getFolderByFolderId(this.$store.state.progression.currentProgression, parentFolderId)
        if (parentFolder.parentId !== 0) { // cannot create subSection of a subSection, so return the sub-section's parent folder id
          parentFolderId = parentFolder.parentId
        }
      }
      if (parentFolderId) {
        this.$store.dispatch('progression/addFolder', parentFolderId)
        this.$store.dispatch('progression/setCreateMenuDisplayed', false)
      } else {
        console.error('Can\'t find parentSection')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.create-button-menu {
  margin-bottom: 11px;
  position: relative;

  .create-button {
    width: 140px;
    border-radius: 32px;

    span {
      margin-left: 12px;
    }
  }

  .create-menu {
    position: absolute;
    top: calc(100% + 7px);
    left: -15px;
    padding: 0 15px;
    min-width: 229px;
    max-width: 500px;
    z-index: 10;
    border: 1px solid #F4F4F4;
    border-radius: 6px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.08);
    color: black;
    font-size: 0.875rem;
    font-weight: 500;

    .create-menu-item {
      height: 35px;
      padding: 0 8px;
      z-index: 100;
      background: white;
      display: flex;
      align-items: center;

      &:hover {
        background-color: #EFF3FB;
        cursor: pointer;
      }

      .create-menu-icon {
        width: 24px;
        height: 24px;
      }

      span {
        margin-left: 11px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }
    }

    hr {
      margin-top: 5px;
      margin-bottom: 5px;
      border: 0;
      border-top: 1px solid #D4D4D4;
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "sessionContent": "CONTENU DE SEANCE",
  "homework": "DEVOIR",
  "section": "SECTION",
  "subSectionOf": "SOUS-SECTION DE "
}
</i18n>
