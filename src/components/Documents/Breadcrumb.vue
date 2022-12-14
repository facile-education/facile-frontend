<template>
  <div
    class="breadcrumb"
    data-test="breadcrumb"
  >
    <HiddenItems
      v-if="hiddenElements.length > 0 && (!mq.phone && !mq.tablet)"
      :items="hiddenElements"
      :is-hoverable="true"
      @optionClicked="changeDir"
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
        @click-back="goInParentFolder(index)"
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
import BreadCrumbItem from '@components/Documents/BreadCrumbItem'
import HiddenItems from '@components/Base/HiddenItems'

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
          hiddenElements.push({ ...originalElem, title: originalElem.name, isHoverable: true })
        }
      })
      return hiddenElements
    }
  },
  methods: {
    goInParentFolder (index) {
      if (index > 0) {
        const parentFolder = this.breadcrumb[index - 1]
        this.$emit('changeDir', parentFolder)
      } else {
        console.error('cannot go in parent folder of a folder with index ' + index)
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
  height: $doc-breadcrumb-size;
  display: flex;
  align-items: center;
  border-bottom: 1px solid $color-border;
}

.chevron {
  width: 6px;
  margin: 0 10px;
}

</style>
