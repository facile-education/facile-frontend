<template>
  <div class="grid">
    <span
      v-for="color in colorList"
      :key="color"
      :style="`background-color:${color};`"
      class="swatch"
      tabindex="0"
      @click="colorPicked(color)"
      @keyup.enter="colorPicked(color)"
    >
      <CustomIcon
        v-if="color === modelValue"
        icon-name="icon-check"
      />
    </span>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'ColorSwatches',
  components: { CustomIcon },
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
@import "@design";

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

  &:hover {
    filter: brightness(115%);
    cursor: pointer;
  }
}

.icon-check {
  font-size: 1.5rem;
  color: $color-light-text;
}
</style>
