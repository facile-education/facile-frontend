<template>
  <label
    class="base-switch"
    :tabindex="tabIndex"
    @keyup.enter="onEnter"
  >
    <input
      v-bind="$attrs"
      :checked="modelValue"
      :disabled="disabled"
      type="checkbox"
      @input="onInput"
    >
    <span class="slider round" />
  </label>
</template>

<script>
export default {
  name: 'WeprodeToggleSwitch',
  props: {
    disabled: {
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
@import 'src/design/common';

.base-switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 20px;

  input:checked + .slider:before {
    transform: translateX(15px);
  }

  input:enabled {
    display: none;

    &:checked + .slider {
      background-color: $valid-color;
    }
  }

  &.partial input:enabled {
    &:checked + .slider {
      background-color: $mixed-color;
    }
  }

  input:disabled + .slider {
    cursor: not-allowed;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $error-color;
  -webkit-transition: .2s;
  transition: .2s;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 1px;
    bottom: 1px;
    background-color: white;
    -webkit-transition: .2s;
    transition: .2s;
  }
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;

  &:before {
    border-radius: 50%;
  }
}
</style>
