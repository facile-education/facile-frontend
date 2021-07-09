<template>
  <div class="service-body">
    <slot />
  </div>
</template>

<script>

export default {
  components: {},
  computed: {},
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
</style>
