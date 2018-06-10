<template>
  <input
    :value="value"
    :class="cls"
    :type="type"
    :maxlength="maxlength"
    :placeholder="placeholder"
    class="input"
    @input="$emit('input', $event.target.value)">
</template>

<script>
export default {
  name: 'NeroInput',
  props: {
    value: {
      type: String,
      default: ''
    },
    cls: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    maxlength: {
      type: Number,
      default: undefined
    },
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.input {
  @extend %nero-input;
}
</style>
