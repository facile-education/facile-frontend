<template>
  <h1 :aria-label="$t('AuthenticationRequired.title')" />
  <div class="error">
    <img
      src="@/assets/icons/user.svg"
      alt=""
    >
    <h2 v-t="'AuthenticationRequired.authRequired'" />
    <p>{{ $t('AuthenticationRequired.redirected') }}</p>
    <div class="spinner-container">
      <WeprodeSpinner class="my-spinner" />
    </div>
  </div>
</template>

<script>

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
export default {
  name: 'AuthenticationRequired',
  components: { WeprodeSpinner },
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
