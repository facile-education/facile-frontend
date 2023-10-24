<template>
  <button
    class="base-button"
    :class="[cls, type]"
    v-bind="$attrs"
  >
    <slot />
    <span :v-if="label">
      {{ label }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'WeprodeButton',
  props: {
    cls: {
      type: String,
      default: 'theme-background-color'
    },
    type: {
      type: String,
      default: 'button'
    },
    label: {
      type: String,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
