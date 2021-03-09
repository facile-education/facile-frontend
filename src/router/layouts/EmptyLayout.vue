<template>
  <div class="service-body">
    <slot />
  </div>
</template>

<script>

export default {
  components: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
.service-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
