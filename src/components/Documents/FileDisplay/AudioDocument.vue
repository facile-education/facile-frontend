<template>
  <audio
    controls
    :autoplay="false"
  >
    <source
      :src="src"
      type="audio/mp3"
    >
    Sorry, your browser doesn't support embedded HTML audio.
  </audio>
</template>

<script>
export default {
  name: 'AudioDocument',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
