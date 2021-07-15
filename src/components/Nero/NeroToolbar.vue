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
@import '@/design';

.toolbar {
  background-color: $color-toolbar-bg;
  padding: 5px;
  display: flex;
  gap: 1rem;
  /* white-space: nowrap;
  overflow-x: auto; */
  z-index: $toolbar-z-index;
  @extend %object-shadow;
}
</style>
