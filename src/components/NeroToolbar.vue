<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'NeroToolbar'
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.toolbar {
  background-color: $toolbar-background-color;
  padding: 5px;
  position: relative;
  /* white-space: nowrap;
  overflow-x: auto; */
  z-index: $service-toolbar-z-index;
  @extend %nero-shadow;
}
</style>
