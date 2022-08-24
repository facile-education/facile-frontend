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
        :is-first-element="index === 0"
        :is-current-folder="index === displayableBreadcrumb.length-1"
        @click-back="goInParentFolder(index)"
      />
      <img
        v-show="(!mq.phone && !mq.tablet) && index < (displayableBreadcrumb.length - 1)"
        class="chevron"
        src="@assets/icon_big_arrow.svg"
        alt=""
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
  computed: {
    breadcrumb () {
      const breadCrumb = JSON.parse(JSON.stringify(this.$store.state.documents.breadcrumb)) // deep copy vuex state to avoid mutate it from here
      // Add dropMethod on each folder to avoid code duplication
      breadCrumb.forEach((folder) => {
        folder.dropMethod = this.dropMethod
      })
      return breadCrumb
    },
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
        if (this.folder.isGroupDirectory) {
          this.$router.push({ name: 'Groups', params: { folderId: this.folder.id } })
        } else {
          this.$router.push({ name: 'Documents', params: { folderId: parentFolder.id } })
        }
      } else {
        console.error('cannot go in parent folder of a folder with index ' + index)
      }
    },
    changeDir (item) {
      if (!this.isCurrentFolder) {
        if (this.folder.isGroupDirectory) {
          this.$router.push({ name: 'Groups', params: { folderId: this.folder.id } })
        } else {
          this.$router.push({ name: 'Documents', params: { folderId: item.id } })
        }
        // this.$store.dispatch('documents/closeDocumentPanel') // TODO: discuss about ergonomics
      }
    },
    dropMethod (event, folder) {
      this.$store.dispatch('clipboard/drop', {
        entities: JSON.parse(event.dataTransfer.getData('entitiesToDrop')),
        folder: folder
      })
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
}

.chevron {
  width: 11px;
  margin: 0 10px;
}

</style>
