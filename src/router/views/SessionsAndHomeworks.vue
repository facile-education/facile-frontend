<template>
  <Layout>
    <p>Cours & Devoirs</p>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'SessionsAndHomeworks',
  components: {
    Layout
  },
  inject: ['mq'],
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
    if (this.configuration === undefined) {
      this.$store.dispatch('cdt/getConfiguration')
      if (this.mq.phone) {
        this.onSelectDate(new Date())
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>

<i18n locale="fr">
{
  "serviceTitle": "Cours & Devoirs"
}
</i18n>
