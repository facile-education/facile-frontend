<template>
  <button
    :class="cls"
    class="button"
    @click="dispatchEvent">
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
  },
  methods: {
    dispatchEvent () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.button {
  @extend %nero-btn-like;
}

.circle {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0;
}

.cancel {
  background-color: #8e7a7a;
  color: $text-color-light;

  &:hover {
    background-color: #e44410;
  }
}
</style>
