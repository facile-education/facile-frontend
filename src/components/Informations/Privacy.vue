<template>
  <div
    class="privacy"
    v-html="template"
  />
</template>

<script>
import axios from 'axios'

export default {
  name: 'Privacy',
  data () {
    return {
      template: ''
    }
  },
  created () {
    axios.get('privacy.html').then(response => {
      this.template = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.privacy {
  max-height: 100%;
  overflow: auto;
  padding-right: 1rem;
}

</style>
