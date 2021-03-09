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
      <ApplicationList :category="category" />
    </div>
  </div>
</template>

<script>
import ApplicationList from '@/components/ApplicationManager/ApplicationList'

export default {
  name: 'CategoryList',
  components: {
    ApplicationList
  },
  computed: {
    categories () {
      return this.$store.getters['applicationManager/categoryList']
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.category {
  padding: 10px;
}

.header {
  margin-top: 0;
  margin-bottom: 5px;
  padding: 10px;
  background: $color-header-bg;
}
</style>
