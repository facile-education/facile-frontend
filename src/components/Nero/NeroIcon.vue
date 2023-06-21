<template>
  <FontAwesomeIcon
    :icon="[type, iconShortName]"
  />
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarAlt, faImage } from '@fortawesome/free-regular-svg-icons'
import {
  faBars, faCaretDown, faCaretLeft, faCaretRight, faCaretUp,
  faCheck, faChevronCircleLeft, faChevronCircleRight, faChevronRight,
  faCog, faExclamationTriangle, faGripLines, faList, faMicrophone, faPause,
  faPencilAlt, faPlay, faPlus, faPowerOff, faSearch, faSignOutAlt, faStop,
  faTimes, faTrash, faUndo, faUser, faUserPlus, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faCalendarAlt,
  faImage,
  faBars,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCheck,
  faChevronCircleLeft,
  faChevronCircleRight,
  faChevronRight,
  faCog,
  faExclamationTriangle,
  faGripLines,
  faList,
  faMicrophone,
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
    // camelizedName () {
    //   return this.name[1].toUpperCase()
    // },
    iconShortName () {
      return this.name.replace('fa-', '')
    }
  }
}
</script>
