<template>
  <iframe
    :src="src"
    class="media"
  />
</template>

<script>
export default {
  name: 'MindMap',
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
