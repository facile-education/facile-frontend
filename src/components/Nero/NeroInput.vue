<template>
  <div class="nero-input">
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
    <p
      v-if="isErrorDisplayed"
      v-t="errorKey"
      class="error-message"
    />
  </div>
</template>

<script>
export default {
  name: 'NeroInput',
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
    },
    errorKey () {
      if (this.errorType !== '') {
        return 'Nero.formErrorMessage.' + this.errorType
      }
      return undefined
    },
    isErrorDisplayed () {
      return (this.errorKey !== undefined)
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

.error-message {
  // background-color: $notif-background-color;
  // color: white;
  color: $text-color-priority;
  font-size: 0.7em;
  padding: 0 8px;
}
</style>
