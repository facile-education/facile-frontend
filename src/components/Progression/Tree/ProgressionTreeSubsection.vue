<template>
  <div
    class="tree-subsection"
  >
    <div
      v-if="draggedSubsection"
      class="dropzone"
      :class="{'first': index === 0}"
      @dragleave="dragLeave"
      @dragover.prevent="dragOver"
      @drop="drop"
    >
      <hr class="theme-border-color">
    </div>
    <div
      class="subsection-header theme-hover-light-background-color"
      :class="{'selected': isSelected, 'theme-background-color': isValidContent }"
      :draggable="true"
      @click="selectSubsection"
      @dragend="onDragEnd"
      @dragleave="dragLeave"
      @dragover.prevent="dragOver"
      @dragstart="onDragStart"
      @drop="drop"
    >
      <div
        class="subsection-name"
        :title="subSection.name"
      >
        <!-- Subsection name -->
        <span>
          {{ subSection.name }}
        </span>
      </div>

      <!-- Number of items -->
      <span
        v-if="!isExpanded"
        class="item-number"
      >
        ({{ nbItems }})
      </span>

      <!-- Right arrow icon -->
      <div class="arrow">
        <img
          src="@assets/arrow-right.svg"
          :class="{'expended': (isExpanded && !draggedSubsection)}"
          :alt="$t('expand')"
          :title="$t('expand')"
        >
        <!--        &lt;!&ndash; Down arrow icon &ndash;&gt;-->
        <!--        <img-->
        <!--          v-if="isExpanded"-->
        <!--          src="@assets/arrow-down.svg"-->
        <!--          :alt="$t('collapse')"-->
        <!--          :title="$t('collapse')"-->
        <!--        >-->
      </div>
    </div>
    <div
      v-if="isLast && draggedSubsection"
      class="dropzone last"
      @dragleave="dragLeave"
      @dragover.prevent="dragOver"
      @drop="drop"
    >
      <hr class="theme-border-color">
    </div>

    <!-- Sub-section items -->
    <div
      v-if="isExpanded"
      class="tree-items"
      :class="{'shrinked': draggedSubsection}"
    >
      <ProgressionTreeItem
        v-for="(item, itemIndex) in subSection.items"
        :key="item.itemId"
        :index="itemIndex"
        :is-parent-section-selected="isSelected"
        :item="item"
        :is-last="itemIndex === (nbItems - 1)"
      />
    </div>
  </div>
</template>

<script>
import ProgressionTreeItem from '@/components/Progression/Tree/ProgressionTreeItem'

export default {
  name: 'ProgressionTreeSubsection',
  components: { ProgressionTreeItem },
  props: {
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    subSection: {
      type: Object,
      required: true
    },
    isParentSectionSelected: {
      type: Boolean,
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
    draggedSubsection () {
      return this.$store.state.progression.draggedSubsection
    },
    isSelected () {
      // Sub-section is selected when itself is selected or its parent section
      return (this.currentFolder && this.currentFolder.folderId === this.subSection.folderId) ||
        this.isParentSectionSelected
    },
    nbItems () {
      if (this.subSection.items === undefined) {
        return 0
      }
      return this.subSection.items.length
    },
    progression () {
      return this.$store.state.progression.currentProgression
    }
  },
  created () {
    this.isExpanded = false
  },
  methods: {
    onDragEnd () {
      this.$store.commit('progression/setDraggedSubsection', undefined)
    },
    dragLeave (e) {
      this.isValidContent = false
      if (this.draggedSubsection) {
        e.target.classList.remove('drag-over')
      }
    },
    dragOver (e) {
      if (this.draggedItem) {
        this.isExpanded = true
        this.isValidContent = (this.draggedItem.item.folderId !== this.subSection.folderId)
      } else if (this.draggedSubsection && this.draggedSubsection.section.folderId !== this.subSection.folderId) {
        e.target.classList.add('drag-over')
      }
    },
    onDragStart (e) {
      const draggedSubsection = {
        index: this.index,
        section: this.subSection
      }
      setTimeout(() => { this.$store.commit('progression/setDraggedSubsection', draggedSubsection) }, 0)
    },
    drop (e) {
      // On drop item
      if (this.draggedItem && this.draggedItem.item.folderId !== this.subSection.folderId) {
        const itemCopy = { ...this.draggedItem.item }
        itemCopy.folderId = this.subSection.folderId
        itemCopy.order = this.nbItems + 1
        this.$store.dispatch('progression/updateItem', itemCopy)
        this.isValidContent = false
      } else if (this.draggedSubsection && this.draggedSubsection.section.folderId !== this.subSection.folderId) {
        // On drop subsection
        const sectionCopy = { ...this.draggedSubsection.section }
        const isLastIndex = (this.isLast && e.target.classList.contains('last'))
        const hasFolderChanged = (sectionCopy.parentId !== this.subSection.parentId)

        // Compute new index
        let newPosition = this.draggedSubsection.index
        if (hasFolderChanged) {
          newPosition = (!isLastIndex) ? this.index + 1 : this.index + 2
        } else {
          newPosition = (this.draggedSubsection.index > this.index || isLastIndex) ? this.index + 1 : this.index
        }

        // Update folder position
        if (hasFolderChanged || this.draggedSubsection.index !== newPosition - 1) {
          sectionCopy.parentId = this.subSection.parentId
          sectionCopy.order = newPosition
          this.$store.dispatch('progression/updateFolder', sectionCopy)
        }
      }
    },
    selectSubsection () {
      let haveToLoadContent = true
      if (this.isSelected || !this.isExpanded) {
        this.isExpanded = !this.isExpanded
        if (!this.isExpanded) { // little optimisation to avoid WS call when user fold the sub-section
          haveToLoadContent = false
        }
      }
      this.$store.dispatch('progression/setCurrentFolder', this.subSection)
      if (haveToLoadContent) {
        this.$store.dispatch('progression/getFolderContent', this.subSection.folderId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.tree-subsection {
  position: relative
}

.dropzone {
  position: absolute;
  top: -20px;
  width: 100%;
  height: 40px;
  display: flex;

  &.last {
    top: 20px;
  }

  &.drag-over hr {
      border-top: 2px solid;
  }

  hr {
    margin: auto;
    width: 100%;
    border: none;
  }
}

.subsection-header {
  height: 40px;
  width: 100%;
  padding-left: 5px;
  display: flex;
  align-items: center;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;

  &.theme-background-color .subsection-name{
    color: inherit;
  }

    &.selected {
    .subsection-name, .item-number{
      color: #306CD3;
    }
  }
}

.subsection-name {
  color: black;
  flex: 1;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 25px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 16px;
  display: flex;
  align-items: center;

  @extend %no-text-highlight;

  span {
    width: 100%;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.item-number {
  font-size: 0.75rem;
  margin-right: 5px;
  margin-left: 5px;
}

.arrow {
  width: 11px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    transition: all .3s ease;
  }

  .expended {
    transform: rotate(90deg);
  }
}

.tree-items {
  margin-left: 13px;
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
  "expand": "Déplier",
  "collapse": "Replier"
}
</i18n>
