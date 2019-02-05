<template>
  <Transition name="window">
    <div :class="{'modal-mask': modal}">
      <div
        class="window-wrapper"
        :class="{'tablet': $device.tablet, 'mobile': $device.phone}"
      >
        <!-- TODO AppDraggable class="window-container" -->
        <div class="window-container">
          <div
            :class="{'important': important}"
            class="window-header theme-background-color"
          >
            <slot name="header" />
            <i
              class="close fa fa-times"
              @click="$emit('close')"
            />
          </div>

          <div class="window-body">
            <slot name="body">
              TODO loading body
            </slot>
          </div>

          <div class="window-footer">
            <slot name="footer" />
          </div>
        </div>
        <!-- /AppDraggable -->
      </div>
    </div>
  </Transition>
</template>

<script>
// import AppDraggable from '@/components/VueDraggableResizable'
// import AppDraggable from '@/components/AppDraggable'

export default {
  name: 'NeroWindow',
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
    important: {
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
}

.window-container {
  background-color: $background-white-color;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.window-header {
  text-align: center;
  text-transform: uppercase;
  padding: 8px;
  position: relative;
  border-radius: 5px 5px 0 0;

  &.important {
    background-color: $text-color-priority;
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
  overflow-y: auto;
}

.window-footer {
  padding: 8px;
  text-align: right;
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
