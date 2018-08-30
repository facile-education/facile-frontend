<template>
  <label class="switch">
    <input
      :checked="value"
      type="checkbox"
      @input="onInput">
    <span class="slider round"/>
  </label>
</template>

<script>
export default {
  name: 'NeroToggleSwitch',
  props: {
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
.switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 20px;

  input {
    display:none;

    &:checked + .slider {
      background-color: #5cb85c;
    }

    /* &:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }*/

    &:checked + .slider:before {
      -webkit-transform: translateX(15px);
      -ms-transform: translateX(15px);
      transform: translateX(15px);
    }
  }

  &.partial input {
    &:checked + .slider {
      background-color: #eb7e36;
    }
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ac2925;
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
