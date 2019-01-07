<template>
  <div class="nero-radio">
    <label class="container">
      {{ label }}
      <input
        v-model="internalValue"
        :name="name"
        :value="rbValue"
        type="radio"
      >
      <span
        :checked="value"
        :class="{'theme-background-color': checked, 'uncheck': !checked}"
        class="checkmark"
      />
    </label>
  </div>
</template>

<script>

export default {
  name: 'NeroRadioButton',
  props: {
    value: {
      type: String,
      default: ''
    },
    rbValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    internalValue: {
      set (newValue) {
        this.$emit('input', newValue)
      },
      get () {
        return this.value
      }
    },
    checked () {
      return this.value === this.rbValue
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.nero-radio {
  display: inline-block;
}

.container {
  display: block;
  position: relative;
  padding-left: 24px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container input {
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
  border-radius: 50%;
}

.uncheck {
  background-color: $background-white-color;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
</style>
