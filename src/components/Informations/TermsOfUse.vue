<template>
  <div
    data-test="terms-of-use"
    class="chart"
    v-html="template"
  />
</template>

<script>
import axios from 'axios'

export default {
  name: 'TermsOfUse',
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
    axios.get(`/resources/chart_${this.locale}.html`).then(response => {
      this.template = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.chart {
  max-height: 100%;
  overflow: auto;
  padding-right: 1rem;
  h1 {
    margin: 0.67em;
  }
}
</style>
