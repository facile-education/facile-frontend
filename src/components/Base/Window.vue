<template>
  <Transition name="window">
    <div
      :class="{'modal-mask': modal}"
      :style="{ 'z-index': zIndex ? zIndex : ''}"
    >
      <div
        class="window-wrapper"
        :class="{'tablet': mq.tablet, 'mobile': mq.phone, 'full-screen': isFullScreen}"
        :style="[{ 'max-width': width ? width : ''}, { 'width': width ? width : ''}]"
      >
        <!-- TODO AppDraggable class="window-container" -->
        <div
          class="window-container"
          :class="{'full-screen': isFullScreen}"
        >
          <div
            :class="{'important': important, 'full-screen': isFullScreen}"
            class="window-header theme-background-color"
          >
            <slot name="header" />
            <i
              v-if="closable"
              data-test="closeModal"
              class="close pc-times"
              @click="$emit('close')"
            />
          </div>

          <div
            class="window-body"
            :class="{'full-screen': isFullScreen}"
            :style="[{ 'max-height': height ? height : ''}, { 'height': height ? height : ''}]"
          >
            <slot name="body">
              TODO loading body
            </slot>
          </div>

          <div
            class="window-footer"
            :class="{'full-screen': isFullScreen}"
          >
            <slot name="footer" />
          </div>
        </div>
        <!-- /AppDraggable -->
      </div>
    </div>
  </Transition>
</template>

<script>

export default {
  name: 'Window',
  inject: ['mq'],
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    draggable: {
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
      type: String,
      default: undefined
    },
    height: {
      type: String,
      default: undefined
    },
    closable: {
      type: Boolean,
      default: true
    },
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close']
}
</script>

<style lang="scss" scoped>
@import 'src/design/common';

.modal-mask {
  position: fixed;
  z-index: $modal-z-index;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.window-wrapper {
  z-index: $modal-z-index;
  max-width: 75%;
  margin: 5vh auto;
  /* Place it in the middle (translation causes issues
  with other animations like filter or toggle */
  /* position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */

  &.tablet {
    max-width: 90%;
  }

  &.mobile {
    margin: 3% auto;
    max-width: 97%;
  }

  &.full-screen {
    margin: 0;
    max-width: 100%;
    width: 100%;
    height: 100%;
  }
}

.window-container {
  background-color: $background-white-color;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;

  &.full-screen {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

.window-header {
  text-align: center;
  text-transform: uppercase;
  padding: 8px;
  position: relative;
  border-radius: 5px 5px 0 0;

  &.important {
    background-color: $error-color;
  }

  &.full-screen {
    height: 10vh;
    display: flex;
    align-items: center;
    background-color: $background-white-color;
    color: #656A6A;
    font-weight: bold;

    .close {
      display: block;
      margin-left: auto;
      margin-right: 7px;
      position: relative;
      top: auto;
      right: auto;
    }
  }

  span {
    margin-right: 20px;
  }

  .close {
    display: inline-block;
    font-size: 22px;
    width: 22px;
    height: 22px;
    position: absolute;
    top: 8px;
    right: 8px;

    &:hover {
      cursor: pointer;
      background-color: rgba(220,220,220,0.2);
      border-radius: 25%;
    }
  }
}

.window-body {
  padding: 8px;
  max-height: 75vh;

  &.full-screen {
    max-height: 80vh;
    height: 100%;
  }
}

.window-footer {
  padding: 8px;
  text-align: right;

  &.full-screen {
    height: 10vh;
    display: flex;
    align-items: center;
  }
}

/*
 * The following styles are auto-applied to elements with
 * transition="window" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.window-enter {
  opacity: 0;
}

.window-leave-active {
  opacity: 0;
}

.window-enter .window-container,
.window-leave-active .window-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
