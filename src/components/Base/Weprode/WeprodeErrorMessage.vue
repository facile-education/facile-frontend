<template>
  <div
    v-if="isErrorDisplayed"
    class="error-message"
  >
    <FAIcon
      name="exclamation-triangle"
      class="icon"
    />
    <label>{{ errorMessage }}</label>
  </div>
</template>

<script>

import FAIcon from '@components/Base/FAIcon.vue'

export default {
  name: 'WeprodeErrorMessage',
  components: { FAIcon },
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
