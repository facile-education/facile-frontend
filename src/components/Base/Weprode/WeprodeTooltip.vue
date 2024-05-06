<template>
  <div
    class="base-tooltip"
    :class="{'phone': mq.phone}"
    data-test="base-tooltip"
    :style="tooltipStyle"
  >
    <header v-if="header">
      <h3>{{ header }}</h3>
      <button
        data-test="closeTooltip"
        :aria-label="$t('Base.WeprodeWindow.close')"
        :title="$t('Base.WeprodeWindow.close')"
        @click="$emit('close')"
      >
        <CustomIcon icon-name="icon-cross-L" />
      </button>
    </header>
    <slot />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'WeprodeTooltip',
  components: { CustomIcon },
  inject: ['mq'],
  props: {
    header: { type: String, default: undefined },
    top: { type: String, default: '' },
    bottom: { type: String, default: '' },
    right: { type: String, default: '' },
    left: { type: String, default: '' }
  },
  emits: ['close'],
  computed: {
    tooltipStyle () {
      return !this.mq.phone ? `top: ${this.top}; bottom: ${this.bottom}; right: ${this.right}; left: ${this.left};` : ''
    }
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.base-tooltip {
  position: absolute;
  background-color: white;
  padding: 1.5rem;
  z-index: 1000;
  border-radius: $border-radius;
  @extend %object-shadow-2;

  &.phone {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
  }
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @extend %font-heading-s;
  @extend %no-text-highlight;

  h3 {
    margin: 0;
    @extend %font-heading-s;
  }

  button {
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
}

</style>
