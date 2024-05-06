<template>
  <div class="hover-panel">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MobileFloatingPanel'
}
</script>

<style lang="scss" scoped>
.hover-panel {
  background-color: white;
  overflow-y: auto;
}

</style>
