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

<style scoped>
.unauthenticatedPage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  font-family: "Roboto", sans-serif;
  color: #0B3C5F;
}
</style>
