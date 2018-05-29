<template>
  <button :class="cls">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    cls: {
      type: String,
      default: 'theme-background-color'
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  border-radius: 5px;
}

.cancel {
  background-color: burlywood;
  color: white;
}
</style>
