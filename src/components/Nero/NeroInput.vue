<template>
  <input
    :value="value"
    :class="classes"
    :type="type"
    :maxlength="maxlength"
    :placeholder="placeholder"
    class="input"
    @input="$emit('input', $event.target.value)"
    @focus="focus"
    @blur="blur"
  >
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
  },
  data () {
    return {
      focused: false
    }
  },
  computed: {
    classes () {
      return this.cls + (this.focused ? ' theme-border-color' : '')
    }
  },
  methods: {
    blur () {
      this.focused = false
      this.$emit('blur')
    },
    focus () {
      this.focused = true
      this.$emit('focus')
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
