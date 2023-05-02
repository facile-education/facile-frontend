<template>
  <header>
    <h2 v-t="'activities'" />
  </header>
</template>

<script>
export default {
  name: 'ActivityHeader'
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
  "activities": "Activités"
}
</i18n>
