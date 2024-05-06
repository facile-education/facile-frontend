<template>
  <div
    class="category-item"
  >
    <h2>
      {{ category.categoryName }}
    </h2>
    <ul v-if="category.accessList.length > 0">
      <li
        v-for="access in sortedAccesses"
        :key="access.title"
      >
        <UserAccess :access="access" />
      </li>
    </ul>
  </div>
</template>

<script>
import UserAccess from '@components/Accesses/AccessVisualization/UserAccess.vue'
import _ from 'lodash'

export default {
  name: 'UserAccessCategory',
  components: { UserAccess },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  computed: {
    sortedAccesses () {
      return _.orderBy(this.category.accessList, 'position', 'asc')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

h2 {
  @extend %font-bold-l;
  margin: 0 0 1rem 0;
}
</style>
