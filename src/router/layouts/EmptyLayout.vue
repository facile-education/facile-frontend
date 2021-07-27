<template>
  <div class="service-body">
    <PentilaSpinner v-if="userId === undefined" />
    <h2
      v-else-if="userId === 0"
      class="msg"
    >
      {{ $t('Layout.authRequired') }}
    </h2>
    <h2
      v-else-if="!isAllowed && !user.isAdministrator"
      class="msg"
    >
      {{ $t('Layout.notAllowed') }}
    </h2>
    <slot v-else />
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    isAllowed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userId () {
      return this.user.userId
    }
  },
  created () {
    this.$store.dispatch('user/initUserInformations')
    this.$store.dispatch('user/getPersonalDetails')
  }
}
</script>

<style lang="scss" scoped>
.service-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.msg {
  text-align: center;
}
</style>
