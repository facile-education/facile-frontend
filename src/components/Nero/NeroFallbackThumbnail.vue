<template>
  <div
    class="image fa fa-image"
  />
</template>

<script>
export default {
  name: 'NeroFallbackThumbnail'
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.image {
  color: $text-color-fallback;
  border: 1px solid $text-color-fallback;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
