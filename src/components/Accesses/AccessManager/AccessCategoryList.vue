<template>
  <ul>
    <li
      v-for="category in categoryList"
      :key="category.categoryId"
    >
      <AccessCategoryItem :category="category" />
    </li>
  </ul>
</template>

<script>
import AccessCategoryItem from '@components/Accesses/AccessManager/AccessCategoryItem.vue'

export default {
  name: 'AccessCategoryList',
  components: { AccessCategoryItem },
  props: {
    categoryList: {
      type: Array,
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

  li {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
