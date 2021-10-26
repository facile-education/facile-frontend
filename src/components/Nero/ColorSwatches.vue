<template>
  <div class="grid">
    <span
      v-for="color in colorList"
      :key="color"
      :style="`background-color:${color};`"
      class="swatch"
      @click="colorPicked(color)"
    >
      <FontAwesomeIcon
        v-if="color === modelValue"
        icon="check"
        class="icon"
      />
    </span>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'ColorSwatches',
  components: { FontAwesomeIcon },
  props: {
    colorList: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    colorPicked (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 40px);
  grid-gap: 5px;
}

.swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0.1rem;
}

.icon {
  color: $color-light-text;
}
</style>
