<template>
  <button
    :class="[cls, type]"
    @click="dispatchEvent($event)"
  >
    <i
      :ng-if="icon"
      :class="icon"
    />
    <span :ng-if="label">
      {{ label }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'NeroButton',
  props: {
    cls: {
      type: String,
      default: 'theme-background-color'
    },
    type: {
      type: String,
      default: 'button'
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
    dispatchEvent ($event) {
      this.$emit('click', $event)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.button {
  @extend %nero-btn-like;

  &:hover {
    filter: brightness(115%);
    @include transition(filter, 0.2s, linear);
  }
}

.circle {
  @extend %nero-btn-like;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  padding: 0;
  line-height: 30px;

  &:hover {
    filter: brightness(115%);
    @include transition(filter, 0.2s, linear);
  }
}

.cancel {
  background-color: #8e7a7a;
  color: $text-color-light;

  &:hover {
    background-color: #e44410;
    filter: none;
    @include transition(background-color, 0.2s, linear);
  }
}
</style>
