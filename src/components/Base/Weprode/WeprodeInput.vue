<template>
  <div
    v-if="labelled && placeholder"
    class="group"
  >
    <input
      v-bind="$attrs"
      ref="input"
      :value="modelValue"
      :placeholder="placeholder"
      :class="{'labelled': labelled, 'default-bg': !focused, 'theme-light-background-color theme-border-color': focused }"
      class="base-input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="onFocus"
      @blur="onBlur"
    >
    <label
      for="name"
      class="label"
      @click="focus"
    >{{ placeholder }}</label>
  </div>
  <input
    v-else
    v-bind="$attrs"
    ref="input"
    :value="modelValue"
    :placeholder="placeholder"
    :class="{'default-bg': !focused, 'theme-light-background-color theme-border-color': focused}"
    class="base-input"
    @input="$emit('update:modelValue', $event.target.value)"
    @focus="onFocus"
    @blur="onBlur"
  >
</template>

<script>
export default {
  name: 'WeprodeInput',
  props: {
    modelValue: {
      type: [String, Number], // Can be a number en case of type=number input (and even an object? in case of fileInput?)
      default: ''
    },
    labelled: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['blur', 'focus', 'update:modelValue'],
  data () {
    return {
      focused: false
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },
    select () {
      this.$refs.input.select()
    },
    onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },
    onFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.group {
  position: relative;
}

.labelled {
  padding-top: 20px;
  padding-bottom: 8px;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ .label {
    cursor: text;
    top: 15px;
    font-size: 1rem;
  }
}

%focused-label {
  position: absolute;
  top: 3px;
  display: block;
  transition: 0.2s;
  font-size: 0.8rem;
  color: #646464;
}

.label {
  padding-left: 16px;

  @extend %focused-label;
}

.labelled:focus {
  ~ .label {
    @extend %focused-label;
  }
}
</style>
