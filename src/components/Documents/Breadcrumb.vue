<template>
  <div class="breadcrumb">
    <template
      v-for="(folder, index) in breadcrumb"
      :key="folder.id"
    >
      <BreadCrumbItem
        :folder="folder"
        :is-first-element="index === 0"
        :is-current-folder="index === breadcrumb.length-1"
        @click-back="goInParentFolder(index)"
      />
      <img
        v-show="(!mq.phone && !mq.tablet) && index < (breadcrumb.length - 1)"
        class="chevron"
        src="@assets/icon_big_arrow.svg"
        alt=""
      >
    </template>
  </div>
</template>

<script>
import BreadCrumbItem from '@components/Documents/BreadCrumbItem'
export default {
  components: { BreadCrumbItem },
  inject: ['mq'],
  computed: {
    breadcrumb () {
      return this.$store.state.documents.breadcrumb
    }
  },
  methods: {
    goInParentFolder (index) {
      if (index > 0) {
        const parentFolder = this.breadcrumb[index - 1]
        this.$store.dispatch('documents/changeDirectory', parentFolder.id)
      } else {
        console.error('cannot go in parent folder of a folder with index ' + index)
      }
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
  margin: 0 15px;
}

</style>
