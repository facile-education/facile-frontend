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
  created () {
    axios.get('chart.html').then(response => {
      this.template = response.data
    })
  }
}
</script>

<style lang="scss" scoped>
.chart {
  max-height: 100%;
  overflow: auto;
  h1 {
    margin: 0.67em;
  }
}
</style>

<i18n locale="fr">
{
  "confidentialityRulesLinkText": "Règles de confidentialité"
}
</i18n>
