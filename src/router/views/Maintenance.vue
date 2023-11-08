<template>
  <p>Service destiné à accueillir des actions de maintenance pour l'équipe technique</p>
</template>

<script>

export default {
  name: 'Maintenance',
  components: {
  },
  inject: ['mq'],
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

</style>

<i18n locale="fr">
{
}
</i18n>
