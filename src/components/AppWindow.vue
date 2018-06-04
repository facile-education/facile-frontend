<template>
  <transition name="window">
    <div :class="{'modal-mask': modal}">
      <div class="window-wrapper">
        <!-- TODO AppDraggable class="window-container" -->
        <div class="window-container">

          <div class="window-header theme-background-color">
            <slot name="header"/>
            <span
              class="close"
              @click="$emit('close')">X</span>
          </div>

          <div class="window-body">
            <slot name="body">
              TODO loading body
            </slot>
          </div>

          <div class="window-footer">
            <slot name="footer"/>
          </div>
        </div>
        <!-- /AppDraggable -->
      </div>
    </div>
  </transition>
</template>

<script>
// import AppDraggable from '@/components/VueDraggableResizable'
// import AppDraggable from '@/components/AppDraggable'

export default {
  name: 'AppWindow',
  // components: {AppDraggable},
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    resizable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

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
  position: fixed;
  max-width: 70vw;
  /* Place it in the middle */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.window-container {
  background-color: $background-light-color;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.window-header {
  text-align: center;
  text-transform: uppercase;
  padding: 8px;
  position: relative;
  height: 16px;
  border-radius: 5px 5px 0 0;

  .close {
    display: inline-block;
    width: 20px;
    height: 16px;
    position: absolute;
    top: 8px;
    right: 8px;

    &:hover {
      cursor: pointer;
    }
  }
}

.window-body {
  padding: 15px;
  max-height: 75vh;
  overflow-y: auto;
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
