<template>
  <div class="nero-checkbox ">
    <label class="container">
      {{ label }}
      <input
        :checked="value"
        type="checkbox"
        class="checkbox"
        @input="onInput"
      >
      <span
        :class="{'theme-background-color': value, 'uncheck': !value}"
        class="checkmark"
      />
    </label>
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

.container {
    padding-left: 25px;
    position: relative;
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
    border-radius: $border-radius;
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
