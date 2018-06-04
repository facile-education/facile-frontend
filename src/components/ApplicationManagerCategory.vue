<template>
  <div v-if="categories">
    <div
      v-for="category in categories"
      :key="category"
      class="category">
      <h4 class="header">{{ category }}</h4>
      <ApplicationManagerServiceList :category="category"/>
    </div>
</div></template>

<script>
import ApplicationManagerServiceList from '@/components/ApplicationManagerServiceList'

export default {
  name: 'ApplicationManagerCategory',
  components: {
    ApplicationManagerServiceList
  },
  computed: {
    categories () {
      return this.$store.getters.categories
    }
  },
  created () {
    if (this.categories === undefined) {
      this.$store.dispatch('getSchoolServices')
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
