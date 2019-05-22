<template>
  <div class="nero-input">
    <input
      :value="value"
      :class="classes"
      :type="type"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input"
      @input="$emit('input', $event.target.value)"
      @focus="focus"
      @blur="blur"
    >
    <NeroErrorMessage :error-type="errorType" />
  </div>
</template>

<script>
import NeroErrorMessage from '@/components/Nero/NeroErrorMessage'

export default {
  name: 'NeroInput',
  components: {
    NeroErrorMessage
  },
  props: {
    cls: {
      type: String,
      default: ''
    },
    errorType: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: undefined
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
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

.nero-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

.input {
  @extend %nero-input;
  margin-bottom: 0;
}
</style>
