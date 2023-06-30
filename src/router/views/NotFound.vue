<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <PentilaSpinner v-if="menu === undefined" />
    <h2
      v-else-if="showMessage"
      v-t="'message'"
    />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'NotFound',
  components: {
    Layout
  },
  data () {
    return {
      showMessage: false
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu.menu
    }
  },
  watch: {
    menu (value) {
      if (value !== undefined) {
        this.$router.push({ path: this.$route.fullPath })
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.showMessage = true
    }, 500)
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "message": "Oups, cette page n'existe pas",
  "serviceTitle": "Erreur 404 : ressource introuvable"
}
</i18n>
