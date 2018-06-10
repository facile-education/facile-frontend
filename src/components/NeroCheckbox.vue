<template>
  <div class="nero-checkbox ">
    <i
      :class="{'checked theme-background-color': value}"
      class="check fa fa-check"/>
    <input
      :checked="value"
      :class="{'theme-background-color': value}"
      type="checkbox"
      class="checkbox"
      @input="onInput">
    <span class="label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'NeroCheckbox',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onInput ($event) {
      this.$emit('input', $event.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
.nero-checkbox {
  position: relative;
}

.check {
  display: none;
  pointer-events: none;
  position: absolute;
  top: 6px;
  left: 7px;
  font-size: 11px;

  &.checked {
    display: initial;
  }
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid rgba(183,183,183,0.3);
  border-radius: $border-radius;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  vertical-align: top;
}

.label {
  vertical-align: bottom;
}
</style>
