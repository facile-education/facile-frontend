<script>
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import { faFile, faFileArchive, faFileImage, faFilePdf, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import {
  faAddressBook, faAngleDoubleLeft, faAngleDoubleRight, faArrowDown,
  faArrowsAlt, faArrowUp, faCaretDown, faCaretLeft, faCaretRight,
  faCaretUp, faChartBar, faCheck, faCheckDouble, faChevronDown,
  faChevronRight, faChevronUp, faCircle, faCode, faCog,
  faCompress, faDatabase, faDownload, faEllipsisV, faExclamationTriangle, faExpand,
  faEye, faFile as regularFaFile, faFileAlt, faFileArchive as regularFaFileArchive, faFileImage as regularFaFileImage, faFilm, faFolder,
  faFolderOpen, faFolderPlus, faGlobe, faHome, faInfoCircle, faMusic,
  faNewspaper, faPaperclip, faPaperPlane, faPlus, faPowerOff, faShare, faShareAlt,
  faSyncAlt, faThumbsUp, faTimes, faUnlock, faUser, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import camelCase from 'lodash/camelCase'

// https://fontawesome.com/icons
fontAwesomeIconLibrary.add(
  faFile, faFileImage, faFileArchive, faFilePdf, faTrashAlt,
  faAddressBook,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faArrowDown,
  faArrowUp,
  faArrowsAlt,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faChartBar,
  faCheck,
  faCheckDouble,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faCircle,
  faCode,
  faCompress,
  faCog,
  faDatabase,
  faDownload,
  faEllipsisV,
  faExclamationTriangle,
  faExpand,
  faEye,
  regularFaFile,
  faFileAlt,
  regularFaFileArchive,
  regularFaFileImage,
  faFilm,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faGlobe,
  faHome,
  faInfoCircle,
  faMusic,
  faNewspaper,
  faPaperPlane,
  faPlus,
  faPowerOff,
  faShare,
  faShareAlt,
  faSyncAlt,
  faThumbsUp,
  faTimes,
  faPaperclip,
  faUnlock,
  faUser,
  faUsers
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
