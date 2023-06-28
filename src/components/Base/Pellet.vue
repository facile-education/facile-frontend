<template>
  <div
    ref="pellet"
    class="pellet theme-background-color"
    :class="{'show-count': showCount}"
  >
    <div v-if="showCount">
      {{ text }}
    </div>
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
  data () {
    return {
      fontSize: 20
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

<style scoped>

.pellet{
  height: 0.75em;
  width: 0.75em;
  border-radius: 50%;

  &.show-count {
    height: 15px;
    width: 20px;
    border-radius: 8px;
    display: flex;
    padding: 4px;
    justify-content: center;
    align-items: center;
    color: white;
    white-space: nowrap;
    font-size: 10px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}

</style>
