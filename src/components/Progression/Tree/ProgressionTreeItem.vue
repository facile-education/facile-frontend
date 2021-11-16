<template>
  <div class="dnd-wrapper">
    <div
      v-if="draggedItem"
      class="dropzone"
      :class="{'first': index === 0}"
      @dragleave="cancelActive"
      @dragover.prevent="setActive"
      @drop="dropFile"
    >
      <hr class="theme-border-color">
    </div>
    <div
      class="tree-item theme-hover-light-background-color"
      :class="{'selected': isSelected }"
      :title="item.name"
      :draggable="true"
      @click="selectItem"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
      <div class="icon">
        <img
          v-if="item.isHomework"
          class="item-type-icon"
          src="@assets/devoir.svg"
          :alt="$t('homework')"
          :title="$t('homework')"
        >
        <img
          v-else
          class="item-type-icon"
          src="@assets/seance.svg"
          :alt="$t('session')"
          :title="$t('session')"
        >
      </div>

      <span>{{ item.name }}</span>
    </div>
    <div
      v-if="isLast && draggedItem"
      class="dropzone last"
      @dragleave="cancelActive"
      @dragover.prevent="setActive"
      @drop="dropFile"
    >
      <hr class="theme-border-color">
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressionTreeItem',
  props: {
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    },
    item: {
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
      isActive: false
    }
  },
  computed: {
    currentItem () {
      return this.$store.state.progression.currentItem
    },
    draggedItem () {
      return this.$store.state.progression.draggedItem
    },
    isSelected () {
      // Item is selected when itself is selected or its parent section/subsection
      return (this.currentItem && this.currentItem.itemId === this.item.itemId) ||
              this.isParentSectionSelected
    }
  },
  methods: {
    selectItem () {
      this.$store.dispatch('progression/getItemContents', this.item)
      this.$store.dispatch('progression/setCurrentItem', this.item)
    },
    onDragStart (e) {
      const draggedItem = {
        index: this.index,
        isSection: false,
        item: this.item
      }
      setTimeout(() => { this.$store.commit('progression/setDraggedItem', draggedItem) }, 0)
    },
    onDragEnd () {
      this.$store.commit('progression/setDraggedItem', undefined)
    },
    setActive (e) {
      const elem = this.draggedItem

      if (!elem.isSection && elem.item.itemId !== this.item.itemId) {
        e.target.classList.add('drag-over')
      }
    },
    cancelActive (e) {
      e.target.classList.remove('drag-over')
    },
    dropFile (e) {
      const elem = this.draggedItem
      const isLastIndex = (this.isLast && e.target.classList.contains('last'))

      if (elem.item.itemId !== this.item.itemId) {
        const itemCopy = { ...elem.item }
        if (elem.item.folderId !== this.item.folderId) {
          itemCopy.order = (!isLastIndex) ? this.index + 1 : this.index + 2
          itemCopy.folderId = this.item.folderId
        } else {
          itemCopy.order = (elem.index > this.index || isLastIndex) ? this.index + 1 : this.index
        }
        this.$store.dispatch('progression/updateItem', itemCopy)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.dnd-wrapper {
  position: relative;
}

.tree-item {
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;

  @extend %no-text-highlight;

  &.selected {
    color: #306CD3;
  }
}

.dropzone {
  position: absolute;
  top: -15px;
  width: 100%;
  height: 30px;
  display: flex;

  &.first {
    top: 0;
    height: 15px;

    hr {
      margin: 0;
    }
  }

  &.last {
    top: 15px;
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

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 3px;
  margin-left: -3px;

  img {
    width: 22px;
    height: 22px;
  }
}

span {
  flex: 1;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.75rem;
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir"
}
</i18n>
