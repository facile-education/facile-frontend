<template>
  <label
    class="base-checkbox"
    :class="{'disabled': disabled, 'right-display': rightDisplay}"
  >
    {{ label }}
    <input
      v-bind="$attrs"
      :checked="modelValue"
      :disabled="disabled"
      tabindex="-1"
      type="checkbox"
      class="checkbox"
      @input="onInput"
    >
    <span
      :tabindex="tabIndex"
      :class="{'disabled': disabled, 'theme-background-color': (modelValue && !disabled) }"
      class="checkmark"
      @keyup.enter="onEnter"
    />
  </label>
</template>

<script>
export default {
  name: 'WeprodeCheckbox',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    rightDisplay: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  computed: {
    tabIndex () {
      return this.disabled ? -1 : 0
    }
  },
  methods: {
    onEnter () {
      if (!this.disabled) {
        this.$emit('update:modelValue', !this.modelValue)
      }
    },
    onInput ($event) {
      this.$emit('update:modelValue', $event.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-checkbox {
    padding-left: 25px;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &.disabled {
      cursor: not-allowed;
      background: none;
    }

    &.right-display {
      padding-left: 0;
      padding-right: 25px;

      .checkmark {
        left: unset;
        right: 0;
      }
    }
}

.base-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    border: 1px solid rgba(183,183,183,0.5);
    outline-color: black;
    &:not(.theme-background-color):not(.disabled) {
      background-color: white;
    }
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.base-checkbox input:checked ~ .checkmark:after {
    display: block;
}

.base-checkbox .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
</style>
