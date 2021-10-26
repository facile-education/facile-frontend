<template>
  <div
    class="swatch"
    :style="`background-color:${modelValue}`"
    @click="toggleSwatches(undefined)"
  >
    <FontAwesomeIcon
      icon="chevron-down"
      class="icon"
    />
  </div>
  <div
    v-if="areSwatchesDisplayed"
    class="popover"
  >
    <ColorSwatches
      :model-value="modelValue"
      :color-list="colorList"
      @update:modelValue="update"
    />
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { defineAsyncComponent } from 'vue'

const ColorSwatches = defineAsyncComponent(() => import('@/components/Nero/ColorSwatches'))

export default {
  name: 'ColorPicker',
  components: { ColorSwatches, FontAwesomeIcon },
  props: {
    colorList: {
      type: Array,
      default: () => ['#99B9E9', '#E47B00', '#8E44AD', '#27AE60', '#2982B9',
        '#7F8C8D', '#16A085', '#34495E', '#E74C3C', '#F1C40F']
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      areSwatchesDisplayed: false
    }
  },
  created () {
    if (this.modelValue === '') {
      this.update(this.colorList[0])
    }
  },
  methods: {
    toggleSwatches (value) {
      this.areSwatchesDisplayed = (value === undefined) ? !this.areSwatchesDisplayed : value
    },
    update (value) {
      this.$emit('update:modelValue', value)
      this.toggleSwatches(false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.swatch {
  display: inline-flex;
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0.1rem;
  align-items: center;
  justify-content: center;
}

.icon {
  color: $color-light-text;
}

.popover {
  position: absolute;
  width: 260px;
  padding: 15px;
  z-index: 1;
  background-color: $color-body-bg;
  box-shadow: 0 3px 6px rgba(0,0,0,.12),0 3px 6px rgba(0,0,0,.24);
}
</style>
