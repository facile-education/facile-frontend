<template>
  <div
    ref="pellet"
    class="pellet theme-background-color"
    :class="{'show-count': showCount}"
  >
    {{ showCount ? text : '' }}
  </div>
</template>

<script>
export default {
  name: 'Pellet',
  props: {
    count: {
      type: Number,
      default: 0
    },
    showCount: {
      type: Boolean,
      default: false
    },
    andMore: {
      type: Boolean,
      default: false
    },
    maxValue: {
      type: Number,
      default: 99
    }
  },
  computed: {
    text () {
      if (this.count > this.maxValue) {
        return this.maxValue + '+'
      } else {
        return this.count + (this.andMore ? '+' : '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.pellet {
  padding: 4px;
  border-radius: 4px;

  &.show-count {
    @extend %count-pellet;
  }

  &:not(.show-count) {
    height: 0.75em;
    width: 0.75em;
    border-radius: 50%;
  }
}

</style>
