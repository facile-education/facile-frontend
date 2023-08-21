<template>
  <div class="picker">
    <div
      class="swatch"
      :style="`background-color:${modelValue}`"
      tabindex="0"
      @click="toggleSwatches(undefined)"
      @keyup.enter="toggleSwatches(undefined)"
      @keydown.esc="onEscape"
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
      <FontAwesomeIcon
        icon="caret-up"
        class="caret"
      />
      <ColorSwatches
        :model-value="modelValue"
        :color-list="colorList"
        @update:modelValue="update"
      />
    </div>
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
    onEscape (e) {
      if (this.areSwatchesDisplayed) {
        this.toggleSwatches(false)
        e.stopPropagation()
      }
    },
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

.picker {
  display: inline-block;
  position: relative;
}

.swatch {
  display: inline-flex;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0.1rem;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
}

.icon {
  color: $color-light-text;
}

.popover {
  position: absolute;
  top: 49px;
  left: 0;
  width: 250px;
  padding: 15px;
  z-index: 1;
  background-color: $color-body-bg;
  border-radius: $border-radius;

  @extend %object-shadow;
}

.caret {
  position: absolute;
  top: -16px;
  left: 16px;
  font-size: 30px;
  color: $color-body-bg;
}
</style>
