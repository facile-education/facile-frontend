<template>
  <iframe
    :src="src"
    class="media"
  />
</template>

<script>
export default {
  name: 'Office',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  beforeUnmount () {
    // TODO
    // DocumentService.removeLoolToken(this.token).then(() => {
    //
    // })
  }
}
</script>

<style scoped>
.media {
  height: 100%;
  width: 100%;
}
</style>
