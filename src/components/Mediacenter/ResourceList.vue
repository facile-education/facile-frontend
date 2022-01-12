<template>
  <div class="resource-list">
    <ResourceItem
      v-for="resource in resourceList"
      :key="resource.id"
      :resource="resource"
    />
  </div>
</template>

<script>
import ResourceItem from '@/components/Mediacenter/ResourceItem'

export default {
  name: 'ResourceList',
  components: { ResourceItem },
  props: {
    resourceList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.resource-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-gap: 0rem;
  justify-content: space-around;
}
</style>
