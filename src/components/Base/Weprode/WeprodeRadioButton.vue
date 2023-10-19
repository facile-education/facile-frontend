<template>
  <label
    class="base-radio"
    :class="{'disabled': disabled}"
  >
    {{ label }}
    <input
      v-model="internalValue"
      v-bind="$attrs"
      :disabled="disabled"
      :name="name"
      :value="rbValue"
      tabindex="-1"
      type="radio"
    >
    <span
      :tabindex="tabIndex"
      :checked="modelValue"
      :class="{'theme-background-color': (checked && !disabled), 'disabled': disabled}"
      class="checkmark"
      @keyup.enter="onEnter"
    />
  </label>
</template>

<script>

export default {
  name: 'WeprodeRadioButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    rbValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  computed: {
    internalValue: {
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      },
      get () {
        return this.modelValue
      }
    },
    checked () {
      return this.modelValue === this.rbValue
    },
    tabIndex () {
      return this.disabled ? -1 : 0
    }
  },
  methods: {
    onEnter () {
      if (!this.disabled) {
        this.internalValue = this.rbValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-radio {
  position: relative;
  padding-left: 24px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &.disabled {
    cursor: not-allowed;
    background: none;
  }
}

.base-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: -1px;
  left: 0;
  width: 18px;
  height: 18px;
  border: 1px solid rgba(183,183,183,0.5);
  border-radius: 50%;
  outline-color: black;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;

  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.base-radio input:checked ~ .checkmark:after {
  display: block;
}
</style>
