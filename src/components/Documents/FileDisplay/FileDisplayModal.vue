<template>
  <div
    class="window"
    data-test="file-display-modal"
    :class="{'full-screen': isFullScreen, 'floating': !isFullScreen}"
  >
    <vue-resizable
      ref="resizeComponent"
      :active="!isFullScreen ? ['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt'] : []"
      :maximize="isFullScreen"
      :width="isFullScreen ? '' : width"
      :height="isFitContent ? 'auto' : height"
      :max-width="viewportWidth"
      :max-heigth="viewportHeight"
      :min-width="300"
      :min-heigth="300"
      :drag-selector="!isFullScreen ? '.header' : undefined"
      :top="!isFullScreen ? initTopValue : ''"
      :left="!isFullScreen ? initLeftValue : ''"
      :fit-parent="true"
    >
      <div
        ref="windowContainer"
        class="container"
      >
        <div class="header theme-border-color">
          <h1 :title="file.name">
            {{ file.name }}
          </h1>
          <div class="header-options">
            <button
              v-if="!mq.phone"
              class="header-option-item"
              data-test="toggleFullScreen"
              @click="toggleFullScreen"
            >
              <BaseIcon
                class="expand"
                :name="isFullScreen ? 'compress' : 'expand'"
              />
            </button>
            <button
              class="header-option-item"
              data-test="closeModal"
              @click="wantsToCloseFile = true"
            >
              <BaseIcon name="times" />
            </button>
          </div>
        </div>

        <div class="body">
          <FileDisplay
            :file="file"
            :wants-to-close-file="wantsToCloseFile"
            @keepOpen="wantsToCloseFile = false"
            @close="close"
          />
        </div>
      </div>
    </vue-resizable>
  </div>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon'
import FileDisplay from '@components/Documents/FileDisplay/FileDisplay'
import VueResizable from 'vue-resizable'

export default {
  name: 'FileDisplayModal',
  components: { BaseIcon, FileDisplay, VueResizable },
  inject: ['mq'],
  props: {
    file: {
      type: Object,
      required: true
    },
    fullScreen: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  data () {
    return {
      viewportWidth: undefined,
      viewportHeight: undefined,
      isFullScreen: false,
      isFitContent: false,
      height: 500,
      wantsToCloseFile: false
    }
  },
  computed: {
    initLeftValue () {
      return this.viewportWidth / 2 - this.width / 2
    },
    initTopValue () {
      return this.viewportHeight / 20 // <=> 5vh
    },
    width () {
      return this.mq.phone ? this.viewportWidth * 9 / 10 : this.viewportWidth * 75 / 100 // Put default values based on viewport height (phone, etc...)
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.isFullScreen = this.fullScreen ? this.fullScreen : this.mq.phone
  },
  mounted () {
    document.onkeydown = this.onKeyDown
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeUnmount () {
    document.onkeydown = null
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    close () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    },
    onResize () {
      this.viewportWidth = document.documentElement.clientWidth
      this.viewportHeight = document.documentElement.clientHeight
    },
    onKeyDown (e) {
      e = e || window.event
      let isEscape = false
      if ('key' in e) {
        isEscape = (e.key === 'Escape' || e.key === 'Esc')
      } else {
        isEscape = (e.keyCode === 27)
      }
      if (isEscape) {
        this.wantsToCloseFile = true
      }
    },
    toggleFullScreen () {
      this.isFullScreen = !this.isFullScreen
      this.$nextTick(() => {
        if (this.isFullScreen) {
          this.viewportWidth = 0
          this.viewportHeight = 0
        } else {
          this.onResize()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

// Header : 50 px, Windows wrapper: 10vh:
$body-max-height: calc(90vh - 50px);
// Header : 50 px:
$body-mobile-max-height: calc(100vh - 50px);
$header-height: 50px;

.window {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, .5);
  z-index: 10;
}

.full-screen .body {
  height: $body-mobile-max-height;
  max-height: $body-mobile-max-height;
}

.floating .container,
.full-screen .container {
  height: 100%;
}

.container {
  background-color: $color-white-bg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  padding: 0 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-weight: bold;
  border-bottom: 1px solid;
  max-height: $header-height;

  @extend %no-text-highlight;
}

h1 {
  font-size: 1.25rem;
  margin: 0;
  line-height: 1.5rem;
  max-width: calc(100% - 20px);
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.header-options {
  margin-left: auto;
  flex-grow: 0;
  flex-shrink: 0;
}

.header-option-item {
  margin-left: 5px;
  background: none;
  border: none;
  height: 30px;
  width: 30px;
  font-size: 1.3rem;

  &:hover {
    cursor: pointer;
    background-color: rgba(220, 220, 220, 0.5);
  }

  &.expand {
    font-size: 1.125rem;
  }
}

.body {
  padding: 10px 0;
  max-width: 100%;
  max-height: calc(100% - #{$header-height});
  flex: 1;
  overflow: auto;
}
</style>
