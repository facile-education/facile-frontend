<template>
  <h1 :aria-label="$t('title')" />
  <div class="error">
    <img
      src="@/assets/user.svg"
      alt=""
    >
    <h2 v-t="'authRequired'" />
    <p>{{ $t('redirected') }}</p>
    <div class="spinner-container">
      <WeprodeSpinner class="my-spinner" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'AuthenticationRequired',
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'GVELayout')
  },
  created () {
    let redirectPath = this.$router.options.history.state.back // The previous route
    if (redirectPath === this.$route.path) { // To avoid infinite redirect loop
      redirectPath = undefined
    }
    setTimeout(() => this.$router.push({ path: '/', query: { redirect: redirectPath } }), 5000)
  }
}
</script>

<style lang="scss" scoped>
.error {
  position: relative;
  text-align: center;
}

img {
  height: 24px;
}

.spinner-container {
  height: 20px;
  width: 100%;
  top: 50px;
  left: 0;
  position: relative;
}
</style>

<i18n locale="fr">
{
  "title": "Authentification requise",
  "authRequired": "Une authentification est requise pour accéder au service.",
  "redirected": "Vous allez être redirigé vers la page d'authentification."
}
</i18n>
