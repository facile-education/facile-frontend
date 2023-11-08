<template>
  <div
    class="breadcrumb"
    data-test="breadcrumb"
  >
    <HiddenItems
      v-if="hiddenElements.length > 0 && (!mq.phone && !mq.tablet)"
      :items="hiddenElements"
      :is-hoverable="true"
      @option-clicked="changeDir"
    />
    <template
      v-for="(folder, index) in displayableBreadcrumb"
      :key="folder.id"
    >
      <BreadCrumbItem
        :folder="folder"
        :hidden-actions="hiddenActions"
        :is-first-element="folder.id === breadcrumb[0].id"
        :is-current-folder="index === displayableBreadcrumb.length-1"
        :previous-folder-name="index >= 1 ? displayableBreadcrumb[index - 1].name : ''"
        :multi-space="multiSpace"
        @click-back="goInParentFolder"
        @change-dir="changeDir"
        @change-space="changeSpace"
      />
      <img
        v-show="(!mq.phone && !mq.tablet) && index < (displayableBreadcrumb.length - 1)"
        class="chevron"
        src="@assets/icon_big_arrow.svg"
        alt="right arrow"
      >
    </template>
  </div>
</template>

<script>
import HiddenItems from '@components/Base/HiddenItems'
import BreadCrumbItem from '@components/Documents/BreadCrumbItem'

export default {
  components: { HiddenItems, BreadCrumbItem },
  inject: ['mq'],
  props: {
    breadcrumb: {
      type: Array,
      required: true
    },
    hiddenActions: {
      type: Boolean,
      default: false
    },
    multiSpace: {
      type: Boolean,
      default: true
    }
  },
  emits: ['changeDir', 'changeSpace'],
  computed: {
    displayableBreadcrumb () {
      return this.breadcrumb.slice(-4) // Only display the fourth elements of the breadcrumb
    },
    hiddenElements () {
      const hiddenElements = []
      let find = false
      this.breadcrumb.forEach(originalElem => {
        this.displayableBreadcrumb.forEach(displayedElement => {
          if (displayedElement.id === originalElem.id) {
            find = true
          }
        })
        if (!find) {
          hiddenElements.push({ ...originalElem, title: originalElem.name, isHoverable: originalElem.permissions.ADD_OBJECT })
        }
      })
      return hiddenElements
    }
  },
  methods: {
    goInParentFolder () {
      if (this.breadcrumb.length > 1) {
        const parentFolder = this.breadcrumb[this.breadcrumb.length - 2]
        this.$emit('changeDir', parentFolder)
      } else {
        console.error('cannot go in parent folder in breadcrumb ' + this.breadcrumb)
      }
    },
    changeDir (folder) {
      if (!this.isCurrentFolder) {
        this.$emit('changeDir', folder)
      }
    },
    changeSpace (space) {
      this.$emit('changeSpace', space)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.breadcrumb {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $color-border;
}

.chevron {
  width: 6px;
  margin: 0 10px;
}

</style>
