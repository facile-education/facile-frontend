<template>
  <li v-if="displayItem">
    <div
      :class="{bold: isFolder}"
      @click="toggle">
      <i :class="classes"/>
      {{ model.name }}
    </div>
    <NeroTree
      v-show="open"
      v-if="isFolder">
      <NeroTreeItem
        v-for="(model, index) in model.children"
        :key="index"
        :model="model"
        class="sub-tree"/>
    </NeroTree>
  </li>
</template>

<script>
export default {
  name: 'NeroTreeItem',
  props: {
    model: {
      type: Object,
      required: true
    },
    foldersOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    isFolder () {
      return this.model.children && this.model.children.length
    },
    displayItem () {
      return (!this.foldersOnly || this.isFolder)
    },
    classes () {
      return !this.isFolder ? 'fa fa-file' : this.open ? 'fa fa-folder-open' : 'fa fa-folder'
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bold {
  color: goldenrod
}

.sub-tree {
  margin-left: 10px;
}
</style>
