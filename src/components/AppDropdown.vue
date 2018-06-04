<template>
  <div class="button">
    <span :ng-if="label">
      {{ label }}
    </span>
    <i class="fa fa-caret-down theme-text-color"/>
  </div>
</template>

<script>
export default {
  name: 'AppDropdown',
  props: {
    label: {
      type: String,
      default: 'toto'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.button {
  @extend %nero-btn-like;
  background-color: #f9f9f9;

  &:hover {
    background-color: #e4e4e4;
  }
}
</style>
