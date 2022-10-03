<template>
  <div
    ref="iconOption"
    :data-test="'option_' + name"
    class="container"
    :class="{'hover': isHovering || forceHovering, 'gray': grayBackgroundColor}"
    :title="title"
    @dragstart.prevent
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    @click="emitClick"
    @mousedown="emitMouseDown"
    @mouseup="emitMouseUp"
  >
    <img
      v-if="(!isHovering && !forceHovering) || iconWhite === ''"
      :style="`height: ${iconHeight};`"
      :src="icon"
      :alt="alt"
    >
    <img
      v-show="(isHovering || forceHovering) && iconWhite!==''"
      :style="`height: ${iconHeight};`"
      :src="iconWhite"
      :alt="alt"
    >
    <div
      v-if="nbNotifications!==0"
      class="notifications"
    >
      {{ nbNotifications }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CadycoIconOption',
  props: {
    icon: {
      type: String,
      required: true
    },
    iconWhite: {
      type: String,
      default: ''
    },
    iconHeight: {
      type: String,
      default: '60%'
    },
    alt: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    nbNotifications: {
      type: Number,
      default: 0
    },
    forceHovering: {
      type: Boolean,
      default: false
    },
    grayBackgroundColor: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'mousedown', 'mouseup'],
  data () {
    return {
      isHovering: false
    }
  },
  methods: {
    emitClick (e) {
      this.$emit('click', e)
    },
    emitMouseDown (e) {
      this.$emit('mousedown', e)
    },
    emitMouseUp (e) {
      this.$emit('mouseup', e)
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import "@design";

  .container {
    position: relative;
    height: 33px;
    width: 33px;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: white;
    /* disable text selection on documents (not convenient when shift-select) */
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none; /* CSS3 (little to no support) */

    &.gray {
      background-color: #F3F6F8;
    }

    &.hover {
      background-color: #27AAE1;
     }
  }

  .notifications {
    position: absolute;
    top: 0;
    right: -3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 15px;
    color: white;
    background-color: red;
    height: 14px;
    width: 14px;
    border-radius: 7px;
  }

  </style>
