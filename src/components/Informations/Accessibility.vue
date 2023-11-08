<template>
  <div
    class="accessibility"
    v-html="template"
  />
</template>

<script>
import axios from 'axios'

export default {
  name: 'Accessibility',
  data () {
    return {
      template: ''
    }
  },
  created () {
    axios.get('accessibility.html').then(response => {
      this.template = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.accessibility {
  max-height: 100%;
  overflow: auto;
  padding-right: 1rem;
}
</style>
