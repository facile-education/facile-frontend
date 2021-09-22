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

  @extend %typography-small;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/*** iPhone and iOS Form Input Zoom Fixes ***/
/* Fix Input Zoom on devices older than iPhone 5: */
@media screen and (device-aspect-ratio: 2/3) {
    select, textarea, input { font-size: 16px; }
}

/* Fix Input Zoom on iPhone 5, 5C, 5S, iPod Touch 5g */
@media screen and (device-aspect-ratio: 40/71) {
    select, textarea, input { font-size: 16px; }
}

/* Fix Input Zoom on iPhone 6, iPhone 6s, iPhone 7  */
@media screen and (device-aspect-ratio: 375/667) {
    select, textarea, input { font-size: 16px; }
}

/* Fix Input Zoom on iPhone 6 Plus, iPhone 6s Plus, iPhone 7 Plus, iPhone 8, iPhone X, XS, XS Max  */
@media screen and (device-aspect-ratio: 9/16) {
    select, textarea, input { font-size: 16px; }
}
</style>
