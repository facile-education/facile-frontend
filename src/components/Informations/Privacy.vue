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
  computed: {
    locale () {
      return this.$store.state.user.locale.frontId
    }
  },
  created () {
    axios.get(`/resources/privacy_${this.locale}.html`).then(response => {
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
