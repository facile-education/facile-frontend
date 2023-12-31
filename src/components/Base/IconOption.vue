<template>
  <button
    ref="iconOption"
    :data-test="'option_' + name"
    class="container"
    :class="{'hover': isHovering || forceHovering}"
    :title="title"
    @dragstart.prevent
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    @click="emitClick"
    @mousedown="emitMouseDown"
    @mouseup="emitMouseUp"
  >
    <img
      v-if="isImage"
      :style="`height: ${iconHeight};`"
      :src="icon"
      :alt="alt"
    >
    <CustomIcon
      v-else
      :style="`font-size: ${iconHeight};`"
      :icon-name="icon"
      :class="{'theme-text-color': active}"
    />
    <span
      v-if="nbNotifications!==0"
      class="notifications"
    >
      {{ nbNotifications }}
    </span>
  </button>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'IconOption',
  components: { CustomIcon },
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
    active: {
      type: Boolean,
      default: false
    },
    nbNotifications: {
      type: Number,
      default: 0
    },
    forceHovering: {
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
  computed: {
    isImage () {
      return this.icon.indexOf('svg') !== -1
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

  button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
  }

  .container {
    --container-size: 30px;
    --container-min-size: 30px;
    position: relative;
    height: var(--container-size);
    min-height: var(--container-min-size);
    width: var(--container-size);
    min-width: var(--container-min-size);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* disable text selection on documents (not convenient when shift-select) */
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none; /* CSS3 (little to no support) */

    &.hover {
      border: 1px solid $color-border;
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
