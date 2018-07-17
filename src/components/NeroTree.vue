<template>
  <ul class="tree">
    <NeroTreeItem
      v-for="(model, index) in model.children"
      :key="index"
      :model="model"
      :folders-only="foldersOnly"
      class="item"/>
  </ul>
</template>

<script>
// import NeroTreeItem from '@/components/NeroTreeItem'

export default {
  name: 'NeroTree',
  components: {
    NeroTreeItem: () => import('@/components/NeroTreeItem.vue')
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    foldersOnly: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.tree {
  list-style: none;
  margin: 0;
  padding: 0;

  @extend %no-text-highlight;
}
</style>
