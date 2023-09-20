<template>
  <h1 :aria-label="$t('serviceTitle')" />
  <PentilaSpinner v-if="menu === undefined" />
  <h2
    v-else-if="showMessage"
    v-t="'message'"
  />
</template>

<script>

export default {
  name: 'NotFound',
  emits: ['update:layout'],
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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
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
