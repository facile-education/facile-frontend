<template>
  <iframe
    :src="src"
    class="media"
  />
</template>

<script>

import fileService from '@/api/documents/file.service'

export default {
  name: 'Office',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    accessToken () {
      const url = new URL('https:/' + this.src) // To have a valid url
      return url.searchParams.get('access_token')
    }
  },
  beforeUnmount () {
    fileService.removeLoolToken(this.accessToken).then((data) => {
      if (!data.success) {
        console.error('Error on removing lool token')
      }
    })
  }
}
</script>

<style scoped>
.media {
  height: 100%;
  width: 100%;
}
</style>
