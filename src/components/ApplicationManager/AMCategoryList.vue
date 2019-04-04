<template>
  <div v-if="categories">
    <div
      v-for="category in categories"
      :key="category"
      class="category"
    >
      <h4 class="header">
        {{ category }}
      </h4>
      <AMApplicationList :category="category" />
    </div>
  </div>
</template>

<script>
import AMApplicationList from '@/components/ApplicationManager/AMApplicationList'

export default {
  name: 'AMCategoryList',
  components: {
    AMApplicationList
  },
  computed: {
    categories () {
      return this.$store.getters['applicationManager/categoryList']
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.category {
  padding: 10px;
}

.header {
  margin-top: 0;
  margin-bottom: 5px;
  padding: 10px;
  background: $header-background-color;
}
</style>
