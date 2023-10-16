<template>
  <component
    :is="layout"
  >
    <RouterView
      v-if="layout !== 'BannerLayout' || menu !== undefined"
      :key="$route.path"
      @update:layout="updateLayout"
    />
    <PentilaSpinner v-else />
  </component>
</template>

<script>
import { setMainColor } from '@/utils/theme.util'

export default {
  inject: ['mq'],
  computed: {
    layout () {
      return this.$store.state.theme.layout
    },
    menu () {
      return this.$store.state.menu.menu
    },
    isIOS () {
      const platform = navigator?.userAgentData?.platform || navigator?.platform || 'unknown'

      return ((/iPad|iPhone|iPod/.test(platform) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
        !window.MSStream)
    },
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    menu (value) {
      // Do not redirect if user has to agree ToS or change his password
      if (value !== undefined && this.user.agreedTermsOfUse && !this.user.passwordChange) {
        this.$router.push({ path: this.$route.fullPath })
      }
    }
  },
  created () {
    setMainColor(this.$store.state.theme.mainColor)

    // In case of iOS device add maximug scale to meta viewport to prevent zoom on input selection
    if (this.isIOS) {
      this.addMaxScaleToViewport()
    }
  },
  beforeUnmount () {
    if (typeof window.screen.orientation !== 'undefined') {
      window.screen.orientation.removeEventListener('change', this.handleOrientationChange, false)
    }
  },
  methods: {
    updateLayout ($event) {
      this.$store.commit('theme/setLayout', $event)
    },
    addMaxScaleToViewport () {
      const el = document.querySelector('meta[name=viewport]')

      if (el !== null) {
        let content = el.getAttribute('content')
        const regex = /maximum-scale=[0-9.]+/g

        if (regex.test(content)) {
          content = content.replace(regex, 'maximum-scale=1.0')
        } else {
          content = [content, 'maximum-scale=1.0'].join(', ')
        }

        el.setAttribute('content', content)
      }
    }
  }
}
</script>

<style lang="scss">
// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '@modules/normalize.css/normalize.css';

// Pentila components library
@import '@modules/pentila-components/dist/nero-theme.css';
@import '@modules/pentila-components/dist/pentila-components.css';

// Design variables and utilities from src/design.
@import '@/design';

@supports(height: 100dvh) {
  #app {
    height: 100dvh !important;
  }
}

html, body, #app {
  height: 100%;
  color: $neutral-100;

  font-family: $system-default-font-family;
  @extend %font-regular-l;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

a {
  color: $color-link;
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

<style lang="scss" scoped>
.layout {
  height: 100%;
}
</style>
