<template>
  <div class="error">
    <h2 v-t="'authRequired'" />
    <p>{{ $t('redirected') }}</p>
    <PentilaSpinner />
  </div>
</template>

<script>
export default {
  name: 'AuthenticationRequired',
  created () {
    setTimeout(() => this.$router.push({ path: '/', query: { redirect: this.$route.fullPath } }), 5000)
  }
}
</script>

<style lang="scss" scoped>
.error {
  margin: 100px;
  text-align: center;
}
</style>

<i18n locale="fr">
{
  "authRequired": "Une authentification est requise pour accéder au service.",
  "redirected": "Vous allez être redirigé vers la page d'authentification."
}
</i18n>
