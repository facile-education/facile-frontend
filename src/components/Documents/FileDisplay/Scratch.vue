<template>
  <iframe
    :src="src"
    title="scratch content"
    class="media"
  />
</template>

<script>
export default {
  name: 'Scratch',
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
