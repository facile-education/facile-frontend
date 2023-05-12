<template>
  <div class="category">
    <div class="title">
      {{ category.categoryName }}
    </div>
    <ul v-if="category.accessList.length > 1">
      <li
        v-for="access in accessList"
        :key="access.accessId"
      >
        <AccessItem :access="access" />
      </li>
    </ul>
  </div>
</template>

<script>
import AccessItem from '@components/Accesses/AccessManager/AccessItem.vue'

export default {
  name: 'AccessCategoryItem',
  components: { AccessItem },
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
