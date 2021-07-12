<template>
  <RouterView />
</template>

<script>
import { setMainColor } from '@/utils/theme.util'

export default {
  created () {
    setMainColor(this.$store.state.theme.mainColor)
    // this.$store.dispatch('auth/checkSession')
  }
}
</script>

<style lang="scss">
// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';

// Pentila components library
@import '~pentila-components/dist/nero-theme.css';
@import '~pentila-components/dist/pentila-components.css';

// Design variables and utilities from src/design.
@import '@/design';

html, body, #app {
  height: 100%;
}

#app {
  @extend %typography-small;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
