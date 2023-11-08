<template>
  <iframe
    :src="pdfjsSrc"
    class="media"
  />
</template>

<script>
export default {
  name: 'PDF',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    pdfjsSrc () {
      return '/PDFjs/web/viewer.html?file=' + encodeURIComponent(this.src)
    }
  }
}
</script>

<style scoped>
  .media {
    height: 100%;
    width: 100%;
  }
</style>
