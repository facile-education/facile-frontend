<template>
  <div
    v-for="category in categoryList"
    :key="category.code"
    class="category"
  >
    <h4 class="header">
      {{ category.name }}
    </h4>
    <ResourceList
      :resource-list="getCategoryResourceList(category)"
      class="resource-list"
    />
  </div>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'

import ResourceList from '@/components/Mediacenter/ResourceList'

export default {
  name: 'CategoryList',
  components: { ResourceList },
  computed: {
    categoryList () {
      const categoryList = []

      this.resourceList.forEach(resource => {
        const category = resource.type
        const catIndex = categoryList.map(category => category.code).indexOf(category.code)
        if (catIndex === -1) {
          categoryList.push(category)
        }
      })

      return WeprodeUtils.sortArrayWithString(categoryList, false, 'name')
    },
    resourceList () {
      return this.$store.state.mediacenter.resourceList
    }
  },
  methods: {
    getCategoryResourceList (category) {
      const categoryResourceList = []

      this.resourceList.forEach(resource => {
        if (resource.type.code === category.code) {
          categoryResourceList.push(resource)
        }
      })

      return WeprodeUtils.sortArrayWithString(categoryResourceList, false, 'name')
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  padding: 10px 0;
}

.header {
  margin-top: 0;
  margin-bottom: 5px;
  padding: 10px;
  background: #f1f1f1;

  &::first-letter {
    text-transform: capitalize;
  }
}
</style>
