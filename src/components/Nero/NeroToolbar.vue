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
  margin-bottom: 20px;
  display: flex;
  gap: 0.8rem;
  /* white-space: nowrap;
  overflow-x: auto; */
  z-index: $toolbar-z-index;
  align-items: center;
  // @extend %object-shadow;
}
</style>
