<template>
  <button class="theme-background-color">
    +
  </button>
</template>

<script>
export default {
  name: 'CreateButton'
}
</script>

<style lang="scss" scoped>
button {
  --size: 33px;
  height: var(--size);
  width: var(--size);
  border-radius: 50%;
  padding: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  cursor: pointer;
  border: none;
}

</style>
