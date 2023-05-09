<template>
  <div
    ref="pellet"
    class="pellet theme-background-color"
  >
    <div
      v-if="showCount"
      :style="'font-size: ' + fontSize + 'px;'"
    >
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
    }
  },
  data () {
    return {
      fontSize: 20
    }
  },
  computed: {
    text () {
      return this.count + (this.andMore ? '+' : '')
    }
  },
  mounted () {
    const defaultFontSize = 20
    const minFontSize = 10
    const letterRatio = 0.5 // to compute letter width

    // Get the width of the string and also the width of the element minus 6 to give it 3px side padding
    const stringWidth = this.text.length * (defaultFontSize * letterRatio) // Very basic and inaccurate width computing
    const elementWidth = this.$refs.pellet.getBoundingClientRect().width - 3

    // Find out how much the font can grow in width.
    const widthRatio = elementWidth / stringWidth
    const newFontSize = Math.floor(15 * widthRatio)
    const elementHeight = this.$refs.pellet.getBoundingClientRect().height - 5 // Same, give it padding by minus some length

    // Pick a new font size so it will not be larger than the height of label.
    let fontSizeToUse = Math.min(newFontSize, elementHeight)

    if (fontSizeToUse < minFontSize) {
      fontSizeToUse = minFontSize
    }

    this.fontSize = fontSizeToUse
  }
}
</script>

<style scoped>

.pellet{
  margin-left: auto;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  color: white;
  text-align: center;
  border-radius: 50%;
  white-space: nowrap;
}

</style>
