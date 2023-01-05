<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import camelCase from 'lodash/camelCase'

// https://fontawesome.com/icons
fontAwesomeIconLibrary.add(
  require('@fortawesome/free-regular-svg-icons/faFile').definition,
  require('@fortawesome/free-regular-svg-icons/faFileImage').definition,
  require('@fortawesome/free-regular-svg-icons/faFileArchive').definition,
  require('@fortawesome/free-regular-svg-icons/faFilePdf').definition,
  require('@fortawesome/free-regular-svg-icons/faTrashAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faAddressBook').definition,
  require('@fortawesome/free-solid-svg-icons/faAngleDoubleLeft').definition,
  require('@fortawesome/free-solid-svg-icons/faAngleDoubleRight').definition,
  require('@fortawesome/free-solid-svg-icons/faArrowDown').definition,
  require('@fortawesome/free-solid-svg-icons/faArrowUp').definition,
  require('@fortawesome/free-solid-svg-icons/faArrowsAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretDown').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretLeft').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretRight').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretUp').definition,
  require('@fortawesome/free-solid-svg-icons/faChartBar').definition,
  require('@fortawesome/free-solid-svg-icons/faCheck').definition,
  require('@fortawesome/free-solid-svg-icons/faCheckDouble').definition,
  require('@fortawesome/free-solid-svg-icons/faChevronDown').definition,
  require('@fortawesome/free-solid-svg-icons/faChevronUp').definition,
  require('@fortawesome/free-solid-svg-icons/faChevronRight').definition,
  require('@fortawesome/free-solid-svg-icons/faCircle').definition,
  require('@fortawesome/free-solid-svg-icons/faCode').definition,
  require('@fortawesome/free-solid-svg-icons/faCompress').definition,
  require('@fortawesome/free-solid-svg-icons/faCog').definition,
  require('@fortawesome/free-solid-svg-icons/faDatabase').definition,
  require('@fortawesome/free-solid-svg-icons/faDownload').definition,
  require('@fortawesome/free-solid-svg-icons/faEllipsisV').definition,
  require('@fortawesome/free-solid-svg-icons/faExclamationTriangle').definition,
  require('@fortawesome/free-solid-svg-icons/faExpand').definition,
  require('@fortawesome/free-solid-svg-icons/faEye').definition,
  require('@fortawesome/free-solid-svg-icons/faFile').definition,
  require('@fortawesome/free-solid-svg-icons/faFileAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faFileArchive').definition,
  require('@fortawesome/free-solid-svg-icons/faFileImage').definition,
  require('@fortawesome/free-solid-svg-icons/faFilm').definition,
  require('@fortawesome/free-solid-svg-icons/faFolder').definition,
  require('@fortawesome/free-solid-svg-icons/faFolderOpen').definition,
  require('@fortawesome/free-solid-svg-icons/faFolderPlus').definition,
  require('@fortawesome/free-solid-svg-icons/faGlobe').definition,
  require('@fortawesome/free-solid-svg-icons/faHome').definition,
  require('@fortawesome/free-solid-svg-icons/faInfoCircle').definition,
  require('@fortawesome/free-solid-svg-icons/faMusic').definition,
  require('@fortawesome/free-solid-svg-icons/faNewspaper').definition,
  require('@fortawesome/free-solid-svg-icons/faPaperPlane').definition,
  require('@fortawesome/free-solid-svg-icons/faPlus').definition,
  require('@fortawesome/free-solid-svg-icons/faPowerOff').definition,
  require('@fortawesome/free-solid-svg-icons/faShare').definition,
  require('@fortawesome/free-solid-svg-icons/faShareAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faSyncAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faThumbsUp').definition,
  require('@fortawesome/free-solid-svg-icons/faTimes').definition,
  require('@fortawesome/free-solid-svg-icons/faPaperclip').definition,
  require('@fortawesome/free-solid-svg-icons/faUnlock').definition,
  require('@fortawesome/free-solid-svg-icons/faUser').definition,
  require('@fortawesome/free-solid-svg-icons/faUsers').definition
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
