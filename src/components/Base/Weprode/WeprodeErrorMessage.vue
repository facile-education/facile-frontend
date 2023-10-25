<template>
  <div
    v-if="isErrorDisplayed"
    class="error-message"
  >
    <NeroIcon
      name="exclamation-triangle"
      class="icon"
    />
    <label>{{ errorMessage }}</label>
  </div>
</template>

<script>

import NeroIcon from '@/components/Nero/NeroIcon.vue'

export default {
  name: 'WeprodeErrorMessage',
  components: { NeroIcon },
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
