<template>
  <div
    v-if="isErrorDisplayed"
    class="error-message"
  >
    <i class="pc-exclamation-triangle" />
    <label>{{ errorMessage }}</label>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
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
@import '@design';

.error-message {
  color: $error-color;
  font-size: 0.7em;
}

.fa {
  margin-right: 5px;
}
</style>
