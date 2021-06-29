<template>
  <div class="unauthenticatedPage">
    <h1 v-t="'Unauthenticated'" />
  </div>
</template>

<script>
export default {
  name: 'UnauthenticatedPage'
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
