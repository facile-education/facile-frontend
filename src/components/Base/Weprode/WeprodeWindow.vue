<template>
  <div
    :class="{'modal-mask': modal, 'full-screen': isFullScreen, 'fixed-height': !isFitContent}"
    :style="{ 'z-index': zIndex ? zIndex : ''}"
  >
    <vue-resizable
      ref="resizeComponent"
      :active="resizable && !isFullScreen ? ['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt'] : []"
      :maximize="isFullScreen"
      :width="isFullScreen ? '' : w"
      :height="isFitContent ? 'auto' : h"
      :max-width="maxW"
      :max-heigth="maxH"
      :min-width="0"
      :min-height="0"
      :drag-selector="(draggable && !isFullScreen) ? '.window-header' : undefined"
      :top="!isFullScreen ? initTopValue : ''"
      :left="!isFullScreen ? initLeftValue : ''"
      :fit-parent="true"
    >
      <div
        ref="windowContainer"
        class="window-container"
        :class="{'full-screen': isFullScreen}"
        @keyup.stop
        @keydown.stop
        @submit.stop
        @drag.stop
      >
        <header
          class="window-header theme-border-color"
          :class="{'important': important}"
        >
          <div class="title">
            <slot name="header" />
          </div>

          <div class="header-options">
            <button
              v-if="resizable && !mq.phone"
              class="header-option-item"
              data-test="toggleFullScreen"
              :aria-label="$t(isFullScreen ? 'Base.WeprodeWindow.collapse' : 'Base.WeprodeWindow.expand')"
              :title="$t(isFullScreen ? 'Base.WeprodeWindow.collapse' : 'Base.WeprodeWindow.expand')"
              @click="toggleFullScreen"
            >
              <img
                v-if="isFullScreen"
                src="@/assets/icons/collapse.svg"
                :alt="$t('collapse')"
              >
              <img
                v-show="!isFullScreen"
                src="@/assets/icons/expand.svg"
                :alt="$t('expand')"
              >
            </button>
            <button
              v-if="closable"
              class="header-option-item"
              data-test="closeModal"
              :aria-label="$t('Base.WeprodeWindow.close')"
              :title="$t('Base.WeprodeWindow.close')"
              @click="$emit('close')"
            >
              <NeroIcon name="times" />
            </button>
          </div>
        </header>

        <div
          class="window-body"
          :class="{'no-footer': hiddenFooter, 'full-screen': isFullScreen}"
        >
          <slot name="body">
            TODO loading body
          </slot>
        </div>

        <div
          v-if="!hiddenFooter"
          class="window-footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </vue-resizable>
  </div>
</template>

<script>

import VueResizable from 'vue-resizable'

import NeroIcon from '@/components/Nero/NeroIcon.vue'

export default {
  name: 'WeprodeWindow',
  components: { NeroIcon, VueResizable },
  inject: ['mq'],
  props: {
    closable: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: false
    },
    important: {
      type: Boolean,
      default: false
    },
    resizable: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: undefined
    },
    width: {
      type: Number,
      default: undefined
    },
    minWidth: {
      type: Number,
      default: 224
    },
    maxWidth: {
      type: Number,
      default: undefined
    },
    height: {
      type: Number,
      default: undefined
    },
    minHeight: {
      type: Number,
      default: 200
    },
    maxHeight: {
      type: Number,
      default: undefined
    },
    fullScreen: {
      type: Boolean,
      default: undefined
    },
    hiddenFooter: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data () {
    return {
      viewportWidth: undefined,
      viewportHeight: undefined,
      isFullScreen: false,
      isFitContent: true,
      h: undefined,
      mouseX: 0,
      mouseY: 0
    }
  },
  computed: {
    w () {
      if (!this.width) {
        return Math.min(this.maxW, this.mq.phone ? this.viewportWidth * 9 / 10 : this.viewportWidth * 75 / 100) // Put default values based on viewport height (phone, etc...)
      } else {
        return Math.min(this.maxW, this.width)
      }
    },
    maxW () {
      return this.maxWidth ? this.maxWidth : this.viewportWidth
    },
    maxH () {
      return this.maxHeight ? this.maxHeight : this.viewportHeight
    },
    initLeftValue () {
      return this.viewportWidth / 2 - this.w / 2
    },
    initTopValue () {
      return this.viewportHeight / 20 // <=> 5vh
    }
  },
  created () {
    this.isFullScreen = this.fullScreen !== undefined ? this.fullScreen : this.mq.phone

    if (this.height) {
      this.isFitContent = false
      this.h = this.height
    }
  },
  mounted () {
    document.onkeydown = this.onKeyDown
    this.onResize()
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  beforeUnmount () {
    document.onkeydown = null
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.viewportWidth = document.documentElement.clientWidth
      this.viewportHeight = document.documentElement.clientHeight
      if (this.isFullScreen) {
        this.$refs.resizeComponent.setMaximize(this.isFullScreen) // Resize component to the new screen size
      }
    },
    onKeyDown (e) {
      e = e || window.event
      let isEscape = false
      if ('key' in e) {
        isEscape = (e.key === 'Escape' || e.key === 'Esc')
      } else {
        isEscape = (e.keyCode === 27)
      }
      if (isEscape && this.closable) {
        this.$emit('close')
      }
    },
    toggleFullScreen () {
      this.isFullScreen = !this.isFullScreen
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design';

// Window padding: 50px, Header : 35 px, footer 44px:
$body-mobile-max-height: calc(100vh - 129px);
$header-height: 35px;
$footer-height: 45px;
$modal-padding: 25px;

.modal-mask {
  position: fixed;
  z-index: $modal-z-index;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;

  &.fixed-height .window-container,
  &.full-screen .window-container {
    height: 100%;
  }

  .window-container {
    background-color: $background-white-color;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    padding: 1.5rem 1rem 1rem 1rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:not(.full-screen) {
      border-radius: $border-radius-nero;
    }

    .window-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 1rem;
      border-radius: 5px 5px 0 0;
      height: $header-height;
      font-size: 1.3rem;
      font-weight: bold;
      border-bottom: 1px solid;

      @extend %no-text-highlight;

      &.important {
        background-color: $error-color;
      }

      .title {
        flex: 1;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .header-options {
        display: flex;
        align-items: center;
        gap: 1rem;

        button {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          img {
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .header-option-item {
          background: none;
          border: none;
          height: 30px;
          width: 30px;
          font-size: 1.3rem;
          padding: 0;

          &:hover {
            cursor: pointer;
            background-color: rgba(220, 220, 220, 0.5);
          }

          &.expand {
            font-size: 1.125rem;
          }
        }
      }
    }

    .window-body {
      margin-top: 1rem;
      max-width: 100%;
      flex: 1;
      overflow: auto;

      &:not(.full-screen) {
        max-height: 70vh;
      }
    }

    .window-footer {
      margin-top: 1rem;
      text-align: right;
    }
  }
}
</style>
