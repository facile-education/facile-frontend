<template>
  <button class="theme-background-color">
    <img
      src="@/assets/icons/icon_plus_white.svg"
      alt="plus"
    >
  </button>
</template>

<script>
export default {
  name: 'CreateButton'
}
</script>

<style lang="scss" scoped>
button {
  --size: 32px;
  height: var(--size);
  width: var(--size);
  border-radius: 50%;
  padding: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;

  &:hover {
    filter: brightness(115%);
    -webkit-transition: .2s filter linear;
    -moz-transition: .2s filter linear;
    -ms-transition: .2s filter linear;
    -o-transition: .2s filter linear;
    transition: .2s filter linear;
  }
}

</style>
