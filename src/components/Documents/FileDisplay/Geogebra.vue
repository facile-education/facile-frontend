<template>
  <iframe
    :src="src"
    title="geogebra content"
    class="media"
  />
</template>

<script>
export default {
  name: 'Geogebra',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .media {
    height: 100%;
    width: 100%;
    border: none;
  }
</style>
