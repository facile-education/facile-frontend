<template>
  <div class="category">
    <h2 class="title">
      {{ category.categoryName }}
    </h2>
    <ul v-if="category.accessList.length > 0">
      <li
        v-for="access in category.accessList"
        :key="access.title"
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

.category {
}

h2 {
  height: 50px;
  background-color: #01d801;
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

ul {
  margin: 0 0 0 1rem;
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
