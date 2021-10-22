<template>
  <div>
    <!-- Current folder name input -->
    <PentilaInput
      v-if="displayFolderName"
      ref="folderName"
      :model-value="updatedFolderName"
      :maxlength="75"
      class="folder-title"
      @update:modelValue="updateFolderName"
      @blur="saveNewFolderName"
    />

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

    <!-- Empty section -->
    <div
      v-else-if="isEmptySection"
      class="empty-section"
    >
      <div
        class="spans"
      >
        <span>{{ $t('emptySection') }}</span>
        <span
          class="blue"
          @click="openCreateMenu"
        >{{ $t('insertNewContent') }}</span>
      </div>
    </div>

    <!-- Empty progression -->
    <div
      v-else-if="isEmptyProgression"
      class="empty-progression"
    >
      <div
        class="spans"
      >
        <span
          class="blue"
          @click="openCreateMenu"
        >{{ $t('addFirstContent') }}</span>
        <div
          class="tips"
        >
          <span
            class="tip-label"
          >{{ $t('tip-label') }}
          </span>
          <span>{{ $t('tip') }}</span>
        </div>
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
      updatedFolderName: '',
      displayFolderName: true
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
          Array.prototype.push.apply(items, this.$store.state.progression.currentFolder.items)
        }
        if (this.$store.state.progression.currentFolder.subSections !== undefined && this.$store.state.progression.currentFolder.subSections.length > 0) {
          for (let subIdx = 0; subIdx < this.$store.state.progression.currentFolder.subSections.length; subIdx++) {
            const subSection = this.$store.state.progression.currentFolder.subSections[subIdx]
            if (subSection.items !== undefined && subSection.items.length > 0) {
              Array.prototype.push.apply(items, subSection.items)
            }
          }
        }
        return items
      } else {
        return []
      }
    },
    isFolderSelected () {
      return this.$store.state.progression.currentFolder !== undefined
    },
    isEmptySection () {
      // A section or sub-section is selected, it has no item and no sub-section
      return this.isFolderSelected && this.itemList.length === 0 && (this.$store.state.progression.currentFolder.subSections === undefined || this.$store.state.progression.currentFolder.subSections.length === 0)
    },
    isEmptyProgression () {
      // A progression is empty if no section nor item
      return (this.$store.state.progression.currentProgression.sections === undefined ||
            this.$store.state.progression.currentProgression.sections.length === 0) &&
            (this.$store.state.progression.currentProgression.items === undefined ||
            this.$store.state.progression.currentProgression.items.length === 0)
    },
    currentFolderName () {
      if (this.$store.state.progression.currentFolder !== undefined) {
        return this.$store.state.progression.currentFolder.name
      }
      return ''
    }
  },
  watch: {
    currentFolderName (newName, oldName) {
      console.log('currentFolderName changes from ', oldName, ' to ', newName)
      // When selected folder changes
      // Put its name in the input
      this.updatedFolderName = newName
      // With focus on it
      if (this.$store.state.progression.currentFolder !== undefined && this.$refs.folderName !== undefined && this.$refs.folderName !== null) {
        this.$nextTick(() => this.$refs.folderName.$el.focus())
      }
    },
    isFolderSelected (newVal, oldVal) {
      console.log('isFolderSelected changes from ', oldVal, ' to ', newVal)
      this.displayFolderName = newVal
    }
  },
  mounted () {
  },
  methods: {
    deleteFolder () {
      this.$store.dispatch('progression/deleteFolder', this.$store.state.progression.currentFolder)
    },
    updateFolderName (value) {
      this.updatedFolderName = value
    },
    saveNewFolderName () {
      if (this.updatedFolderName !== this.$store.state.progression.currentFolder.name) {
        this.$store.dispatch('progression/updateFolderName', { folder: this.$store.state.progression.currentFolder, newFolderName: this.updatedFolderName })
      }
    },
    openCreateMenu () {
      this.$store.dispatch('progression/setCreateMenuDisplayed', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.folder-title {
  width: 98%;
  margin-left: 10px;
  margin-right: 10px;
}
.items-list {
  width: 100%;
  margin-right: 10px;
    .item {
    width: 100%;
    margin-right: 10px;
  }
}
.empty-section, .empty-progression {

  height: 400px;
  border: 1px solid #D4D4D4;
  border-radius: 6px;
  background-color: #FFFFFF;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  .spans {
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: auto;
    .tips {
      display: flex;
    }
    .blue {
      color: blue;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
    .tip-label {
      font-weight: bold;
      margin-right: 5px;
    }
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
  "emptySection": "Cette section est vide",
  "insertNewContent": "Ajouter le premier contenu de votre section",
  "addFirstContent": "Ajouter le premier contenu de votre progression!",
  "tip-label": "Astuces : ",
  "tip": "vous pouvez ajouter des sections et des sous-sections pour organiser votre progression."
}
</i18n>
