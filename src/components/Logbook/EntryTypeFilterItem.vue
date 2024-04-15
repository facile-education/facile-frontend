<template>
  <button
    :class="{ 'theme-background-color': isActive, 'theme-border-color': isActive }"
    @click="toggleSelection"
  >
    {{ label }}
  </button>
</template>

<script>

export default {
  name: 'EntryTypeFilterItem',
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: Number,
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
      this.isActive ? this.$emit('remove') : this.$emit('add', this.type)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

button {
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid $neutral-60;
  padding: 2px 8px;
  @extend %font-regular-xs
}
</style>
