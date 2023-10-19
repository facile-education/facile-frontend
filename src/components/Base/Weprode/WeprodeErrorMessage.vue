<template>
  <div
    v-if="isErrorDisplayed"
    class="error-message"
  >
    <FontAwesomeIcon
      icon="exclamation-triangle"
      class="icon"
    />
    <label>{{ errorMessage }}</label>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  require('@fortawesome/free-solid-svg-icons/faExclamationTriangle').definition
)

export default {
  name: 'WeprodeErrorMessage',
  components: { FontAwesomeIcon },
  props: {
    errorMessage: {
      type: String,
      default: ''
    }
  },
  computed: {
    isErrorDisplayed () {
      return (this.errorMessage !== undefined && this.errorMessage !== '')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design/common';

.error-message {
  color: $error-color;
  font-size: 0.7rem;
}

.icon {
  margin-right: 0.3rem;
}
</style>
