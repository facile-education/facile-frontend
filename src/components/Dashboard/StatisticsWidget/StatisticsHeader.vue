<template>
  <header>
    <h2 v-t="'statistics'" />
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

<i18n locale="fr">
{
  "statistics": "Statistiques"
}
</i18n>
