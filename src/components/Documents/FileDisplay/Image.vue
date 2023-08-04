<template>
  <img
    :src="src"
    :alt="$t('unknown-url')"
    class="img"
  >
</template>

<script>
export default {
  name: 'Image',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .img{
    max-width: 100%;
    max-height: 100%;
  }
</style>

<i18n locale="fr">
  {
    "unknown-url": "Document non disponible"
  }
</i18n>
