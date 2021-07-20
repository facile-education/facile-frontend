<template>
  <div class="unauthenticatedPage">
    <h1
      v-if="hasNotGoodRole"
      v-t="'UnAuthorised'"
    />
    <h1
      v-else
      v-t="'Unauthenticated'"
    />
  </div>
</template>

<script>
export default {
  name: 'UnauthenticatedPage',
  computed: {
    hasNotGoodRole () {
      return this.$store.state.user.userId !== 0 && !(this.$store.state.user.isTeacher || this.$store.state.user.isPersonal)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

  .unauthenticatedPage {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-family: "Roboto", sans-serif;
    color: $color-cadyco-dark-text;
  }
</style>
