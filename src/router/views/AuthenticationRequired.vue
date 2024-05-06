<template>
  <h1 :aria-label="$t('AuthenticationRequired.title')" />
  <div class="error">
    <CustomIcon :icon-name="'icon-user-24'" />
    <h2 v-t="'AuthenticationRequired.authRequired'" />
    <p>{{ $t('AuthenticationRequired.redirected') }}</p>
    <div class="spinner-container">
      <WeprodeSpinner class="my-spinner" />
    </div>
  </div>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
export default {
  name: 'AuthenticationRequired',
  components: { CustomIcon, WeprodeSpinner },
  emits: ['update:layout'],
  beforeCreate () {
    this.$emit('update:layout', 'PublicLayout')
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

.icon-user {
  font-size: 24px;
}

.spinner-container {
  height: 20px;
  width: 100%;
  top: 50px;
  left: 0;
  position: relative;
}
</style>
