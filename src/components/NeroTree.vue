<template>
  <ul>
    <NeroTreeItem
      v-for="(model, index) in model.children"
      :key="index"
      :model="model"
      :folders-only="foldersOnly"
      class="item"/>
  </ul>
</template>

<script>
import NeroTreeItem from '@/components/NeroTreeItem'

export default {
  name: 'NeroTree',
  components: {
    NeroTreeItem
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

</style>
