<template>
  <slot />
</template>

<script>
// the goal of this component is to crate a empty component to have conditional rendering of a parent element using the 'component' tag
export default {
  inheritAttrs: false
}
</script>
