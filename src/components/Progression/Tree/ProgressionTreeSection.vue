<template>
  <div
    class="tree-section"
  >
    <hr>
    <div
      v-if="draggedSection"
      class="dropzone"
      @dragleave="dragLeave"
      @dragover.prevent="dragOver"
      @drop="drop"
    >
      <hr
        class="theme-border-color"
        :class="{'bottom': (draggedSection.index < index)}"
      >
    </div>
    <!-- Section name -->
    <div
      class="section-name theme-hover-light-background-color"
      :class="{'selected': isSelected, 'theme-background-color': isValidContent }"
      :title="section.name"
      :draggable="true"
      @click="selectSection"
      @dragend="onDragEnd"
      @dragleave="dragLeave"
      @dragover.prevent="dragOver"
      @dragstart="onDragStart"
      @drop="drop"
    >
      <span>{{ section.name }}</span>
    </div>

    <!-- Sub-sections -->
    <div
      v-if="isExpanded"
      class="sub-sections"
      :class="{'shrinked': draggedSection}"
    >
      <ProgressionTreeSubsection
        v-for="(subSection, sectionIndex) in section.subSections"
        :key="subSection.folderId"
        :index="sectionIndex"
        :is-parent-section-selected="isSelected"
        :sub-section="subSection"
        :is-last="sectionIndex === (section.subSections.length - 1)"
      />
    </div>
    <div
      v-if="isExpanded"
      class="section-items"
      :class="{'shrinked': draggedSection}"
    >
      <ProgressionTreeItem
        v-for="(item, itemIndex) in section.items"
        :key="item.itemId"
        :index="itemIndex"
        :is-parent-section-selected="isSelected"
        :item="item"
        :is-last="itemIndex === (section.items.length - 1)"
      />
    </div>
  </div>
</template>

<script>
import ProgressionTreeItem from '@/components/Progression/Tree/ProgressionTreeItem'
import ProgressionTreeSubsection from '@/components/Progression/Tree/ProgressionTreeSubsection'

export default {
  name: 'ProgressionTreeSection',
  components: { ProgressionTreeSubsection, ProgressionTreeItem },
  props: {
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    section: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isExpanded: true,
      isValidContent: false
    }
  },
  computed: {
    currentFolder () {
      return this.$store.state.progression.currentFolder
    },
    draggedItem () {
      return this.$store.state.progression.draggedItem
    },
    draggedSection () {
      return this.$store.state.progression.draggedSection
    },
    draggedSubsection () {
      return this.$store.state.progression.draggedSubsection
    },
    isSelected () {
      return this.currentFolder !== undefined && this.currentFolder.folderId === this.section.folderId
    },
    progression () {
      return this.$store.state.progression.currentProgression
    }
  },
  created () {
    this.isExpanded = true
  },
  methods: {
    onDragEnd () {
      this.$store.commit('progression/setDraggedSection', undefined)
    },
    dragLeave (e) {
      this.isValidContent = false
      if (this.draggedSection) {
        e.target.classList.remove('drag-over')
      }
    },
    dragOver (e) {
      if (this.draggedItem) {
        this.isValidContent = (this.draggedItem.item.folderId !== this.section.folderId)
      } else if (this.draggedSubsection) {
        this.isValidContent = (this.draggedSubsection.section.parentId !== this.section.folderId)
      } else if (this.draggedSection && this.draggedSection.section.folderId !== this.section.folderId) {
        e.target.classList.add('drag-over')
      }
    },
    onDragStart (e) {
      const draggedSection = {
        index: this.index,
        section: this.section
      }
      setTimeout(() => { this.$store.commit('progression/setDraggedSection', draggedSection) }, 0)
    },
    drop () {
      if (this.draggedItem && this.draggedItem.item.folderId !== this.section.folderId) {
        const itemCopy = { ...this.draggedItem.item }
        itemCopy.folderId = this.section.folderId
        itemCopy.order = this.section.items.length + 1
        this.$store.dispatch('progression/updateItem', itemCopy)
        this.isValidContent = false
      } else if (this.draggedSubsection && this.draggedSubsection.section.parentId !== this.section.folderId) {
        const sectionCopy = { ...this.draggedSubsection.section }
        sectionCopy.parentId = this.section.folderId
        sectionCopy.order = this.section.subSections.length + 1
        this.$store.dispatch('progression/updateFolder', sectionCopy)
        this.isValidContent = false
      } else if (this.draggedSection && this.draggedSection.section.folderId !== this.section.folderId) {
        const sectionCopy = { ...this.draggedSection.section }
        const newPosition = this.index + 1

        // Update folder position
        if (this.draggedSection.index !== newPosition - 1) {
          sectionCopy.order = newPosition
          this.$store.dispatch('progression/updateFolder', sectionCopy)
        }
      }
    },
    selectSection () {
      this.$store.dispatch('progression/setCurrentFolder', this.section)
      this.$store.dispatch('progression/getFolderContent', this.section.folderId)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-section {
  position: relative;

  hr {
    margin: 0;
    border: 0; border-top: 1px solid #D4D4D4;
  }
}

.dropzone {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 50px;
  display: flex;

  &.drag-over hr {
    border-top: 2px solid;
  }

  hr {
    margin: 0;
    width: 100%;
    border: none;

    &.bottom {
      margin-top: auto;
    }
  }
}

.section-name {
  padding-left: 5px;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;

  &.theme-background-color span {
    color: inherit
  }

  &.selected span {
    color: #306CD3;
  }

  span {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000000;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
  }
}

.sub-sections {
  margin-left: 0;
  max-height: 100vh;
  transition: max-height .3s;
}

.section-items {
  margin-left: 0;
  max-height: 100vh;
  transition: max-height .3s;
}

.shrinked {
  overflow: hidden;
  max-height: 0;
}
</style>

<i18n locale="fr">
{
  "add": "Créer"
}
</i18n>
