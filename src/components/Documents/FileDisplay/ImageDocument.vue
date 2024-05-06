<template>
  <img
    :src="src"
    :alt="$t('Documents.ImageDocument.unknown-url')"
    class="img"
  >
</template>

<script>
export default {
  name: 'ImageDocument',
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
