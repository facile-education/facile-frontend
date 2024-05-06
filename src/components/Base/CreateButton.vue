<template>
  <button class="theme-background-color">
    <CustomIcon :icon-name="'icon-plus'" />
  </button>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'CreateButton',
  components: { CustomIcon }
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
