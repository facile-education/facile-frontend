<template>
  <div
    v-if="isErrorDisplayed"
    class="error-message"
  >
    <i class="fa fa-exclamation-triangle" />
    <label v-t="errorKey" />
  </div>
</template>

<script>
export default {
  name: 'NeroErrorMessage',
  props: {
    errorType: {
      type: String,
      default: ''
    }
  },
  computed: {
    errorKey () {
      if (this.errorType !== '') {
        return 'Nero.formErrorMessage.' + this.errorType
      }
      return undefined
    },
    isErrorDisplayed () {
      return (this.errorKey !== undefined)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.error-message {
  color: $text-color-priority;
  font-size: 0.7em;
}

.fa {
  margin-right: 5px;
}
</style>
