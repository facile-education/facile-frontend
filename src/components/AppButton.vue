<template>
  <button
    :class="cls"
    class="button">
    <i
      :ng-if="icon"
      :class="icon"/>
    <span :ng-if="label">
      {{ label }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    cls: {
      type: String,
      default: 'theme-background-color'
    },
    label: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.button {
  @extend %nero-btn-like;
}

.cancel {
  background-color: #8e7a7a;
  color: $text-color-light;

  &:hover {
    background-color: #e44410;
  }
}
</style>
