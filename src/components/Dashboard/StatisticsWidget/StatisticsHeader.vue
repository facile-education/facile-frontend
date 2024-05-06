<template>
  <header>
    <h2 v-t="'Dashboard.StatisticsHeader.statistics'" />
  </header>
</template>

<script>

export default {
  name: 'StatisticsHeader'
}
</script>

<style lang="scss" scoped>
@import "@design";

header {
  @extend %widget-header;
}

h2 {
  @extend %widget-h2;
}
</style>
