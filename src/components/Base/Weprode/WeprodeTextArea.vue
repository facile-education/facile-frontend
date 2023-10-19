<template>
  <div
    v-if="labelled && placeholder"
    class="group"
  >
    <textarea
      v-bind="$attrs"
      ref="input"
      :value="modelValue"
      :placeholder="placeholder"
      :class="{'labelled': labelled, 'default-bg': !focused, 'theme-light-background-color theme-border-color': focused }"
      class="base-input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focus"
      @blur="blur"
    />
    <label
      for="name"
      class="label"
      @click="changeFocus"
    >{{ placeholder }}</label>
  </div>
  <textarea
    v-else
    v-bind="$attrs"
    ref="input"
    :value="modelValue"
    :placeholder="placeholder"
    :class="{'default-bg': !focused, 'theme-light-background-color theme-border-color': focused}"
    class="base-input"
    @input="$emit('update:modelValue', $event.target.value)"
    @focus="focus"
    @blur="blur"
  />
</template>

<script>
export default {
  name: 'WeprodeTextArea',
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
    changeFocus () {
      this.$refs.input.focus()
    },
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
