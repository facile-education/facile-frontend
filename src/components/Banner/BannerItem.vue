<template>
  <button
    :title="title"
    :aria-label="title"
    @click="$emit('click')"
  >
    <img
      v-if="src"
      :src="src"
      :alt="title"
    >
  </button>
</template>

<script>

export default {
  name: 'BannerItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    }
  },
  emits: ['click']
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  height: 32px;

  img {
    height: 100%;
  }
}
</style>
