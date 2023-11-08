<template>
  <iframe
    v-if="isReady"
    :src="newUrl"
    class="media"
  />
</template>

<script>
export default {
  name: 'OtherDocument',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isReady: false,
      file: undefined,
      newUrl: undefined
    }
  },
  mounted () {
    this.getFile(this)
  },
  methods: {
    getFile (vm) {
      let blob = null
      const xhr = new XMLHttpRequest()
      xhr.open('GET', this.src)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        blob = xhr.response
        // Change the content-type of the blob (which is basely binary) to display it
        blob = blob.slice(0, blob.size, 'text/plain')
        vm.newUrl = window.URL.createObjectURL(blob) // /!\ don't work on IE? -> to test
        vm.file = blob
        vm.isReady = true
      }
      xhr.send()
    }
  }
}
</script>

<style scoped>
  .media{
    height: 100%;
    width: 100%;
  }

</style>
