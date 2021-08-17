<template>
  <li v-if="displayItem">
    <div
      :class="{folder: isFolder}"
      @click="toggle"
    >
      <i
        v-if="isFolder"
        :class="{'rotate': isOpen}"
        class="fa fa-caret-right"
      />
      <i :class="classes" />
      {{ model.name }}
    </div>
    <NeroTree
      v-show="isOpen"
      v-if="isFolder"
      :model="model"
      :folders-only="foldersOnly"
      class="sub-tree"
    />
  </li>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const NeroTree = defineAsyncComponent(() => import('@/components/Nero/NeroTree'))

export default {
  name: 'NeroTreeItem',
  components: {
    NeroTree
  },
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
      isOpen: false
    }
  },
  computed: {
    isFolder () {
      return !this.model.isLeaf || (this.model.children && this.model.children.length)
    },
    displayItem () {
      return (!this.foldersOnly || this.isFolder)
    },
    classes () {
      return !this.isFolder ? 'fa fa-file' : this.isOpen ? 'fa fa-folder-open' : 'fa fa-folder'
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fa-folder, .fa-folder-open {
  color: goldenrod;
}

.fa-caret-right.rotate {
  transform: rotate(45deg);
}

.sub-tree {
  margin-left: 10px;
}
</style>
