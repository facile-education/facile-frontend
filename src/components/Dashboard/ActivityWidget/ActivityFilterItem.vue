<template>
  <button
    :class="{'theme-background-color': isActive, 'theme-border-color': isActive}"
    @click="toggleSelection"
  >
    {{ name }}
  </button>
</template>

<script>
export default {
  name: 'ActivityFilterItem',
  props: {
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  emits: ['remove', 'add'],
  methods: {
    toggleSelection () {
      this.isActive ? this.$emit('remove') : this.$emit('add')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  height: 30px;
  cursor: pointer;
  border-radius: 6px;
  padding: 0 10px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 1px solid $color-border;
}
</style>
