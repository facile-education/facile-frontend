<template>
  <video
    controls
    :autoplay="false"
    class="video"
  >
    <source
      :src="src"
      type="video/mp4"
    >
    Sorry, your browser doesn't support embedded videos.
  </video>
</template>

<script>
export default {
  name: 'Video',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  .video{
    max-width: 100%;
    width: 100%;
  }
</style>
