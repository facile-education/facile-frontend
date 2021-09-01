<template>
  <FontAwesomeIcon
    :icon="[type, iconShortName]"
  />
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(
  require('@fortawesome/free-regular-svg-icons/faCalendarAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretDown').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretLeft').definition,
  require('@fortawesome/free-solid-svg-icons/faCaretRight').definition,
  require('@fortawesome/free-solid-svg-icons/faChevronCircleLeft').definition,
  require('@fortawesome/free-solid-svg-icons/faChevronCircleRight').definition,
  require('@fortawesome/free-solid-svg-icons/faExclamationTriangle').definition,
  require('@fortawesome/free-solid-svg-icons/faList').definition,
  require('@fortawesome/free-solid-svg-icons/faPencilAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faSignOutAlt').definition,
  require('@fortawesome/free-solid-svg-icons/faTrash').definition,
  require('@fortawesome/free-solid-svg-icons/faUser').definition,
  require('@fortawesome/free-solid-svg-icons/faUserPlus').definition,
  require('@fortawesome/free-solid-svg-icons/faUsers').definition
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
