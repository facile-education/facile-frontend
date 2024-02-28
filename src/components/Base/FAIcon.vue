<script>
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import {
  faCaretDown, faCaretLeft, faCaretRight, faCaretUp,
  faExclamationTriangle,
  faFileZipper,
  faFolderOpen,
  faGripLines,
  faPause,
  faPlay,
  faStop,
  faUndo
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import camelCase from 'lodash/camelCase'

// https://fontawesome.com/icons
fontAwesomeIconLibrary.add(
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faExclamationTriangle,
  faFileZipper,
  faFolderOpen,
  faGripLines,
  faPause,
  faPlay,
  faStop,
  faUndo
)

export default {
  components: {
    FontAwesomeIcon
  },
  inheritAttrs: false,
  props: {
    source: {
      type: String,
      default: 'font-awesome'
    },
    name: {
      type: [String, Array],
      required: true
    }
  },
  emits: ['click', 'mousedown', 'mouseup'],
  computed: {
    // Gets a CSS module class, e.g. iconCustomLogo
    customIconClass () {
      return this.$style[camelCase('icon-custom-' + this.name)]
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

<template>
  <FontAwesomeIcon
    v-if="source === 'font-awesome'"
    v-bind="$attrs"
    :icon="name"
    @click="emitClick"
    @mousedown="emitMouseDown"
    @mouseup="emitMouseUp"
  />
  <span
    v-else-if="source === 'custom'"
    v-bind="$attrs"
    :class="customIconClass"
  />
</template>
