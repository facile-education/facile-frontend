<template>
  <div class="toolbar">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FacileToolbar'
}
</script>

<style lang="scss" scoped>
@import '@/design';

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 0.8rem;
  z-index: $toolbar-z-index;
  align-items: center;
}
</style>
