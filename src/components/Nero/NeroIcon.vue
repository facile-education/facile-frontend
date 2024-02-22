<template>
  <FontAwesomeIcon
    :icon="[type, iconShortName]"
  />
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCaretDown, faCaretLeft, faCaretRight, faCaretUp,
  faExclamationTriangle, faGripLines, faPause,
  faPencilAlt, faPlay, faPlus, faPowerOff, faSearch, faSignOutAlt, faStop,
  faTimes, faTrash, faUndo, faUser, faUserPlus, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faExclamationTriangle,
  faGripLines,
  faPause,
  faPencilAlt,
  faPlay,
  faPlus,
  faPowerOff,
  faSearch,
  faSignOutAlt,
  faStop,
  faTimes,
  faTrash,
  faUndo,
  faUser,
  faUserPlus,
  faUsers
)

export default {
  name: 'NeroIcon',
  components: {
    FontAwesomeIcon
  },
  props: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'fas'
    }
  },
  computed: {
    iconShortName () {
      return this.name.replace('fa-', '')
    }
  }
}
</script>
