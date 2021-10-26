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
  padding: 5px;
  display: flex;
  gap: 0.5rem;
  /* white-space: nowrap;
  overflow-x: auto; */
  z-index: $toolbar-z-index;
  align-items: center;
  // @extend %object-shadow;
}
</style>
