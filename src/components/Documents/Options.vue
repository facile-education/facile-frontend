<template>
  <div
    ref="optionsContainer"
    class="current-options"
    data-test="current-options"
  >
    <OptionItem
      v-for="(option, index) in visibleOptions"
      :key="index"
      :option="option"
      @addSize="addOptionSize($event, index)"
      @optionClicked="emitOption"
    />
    <HiddenItems
      v-if="hiddenOptions.length > 0"
      :items="hiddenOptions"
      @optionClicked="emitOption"
    />
  </div>
</template>

<script>
import OptionItem from '@components/Documents/OptionItem'
import HiddenItems from '@components/Base/HiddenItems'

export default {
  name: 'Options',
  components: { HiddenItems, OptionItem },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  emits: ['optionClicked'],
  data () {
    return {
      width: 0,
      optionsWidthArray: [],
      visibleOptions: [...this.options],
      hiddenOptions: []
    }
  },
  watch: {
    options (value) {
      this.visibleOptions = [...value]
      this.hiddenOptions = []
    }
  },
  mounted () {
    this.getWidth()
    window.addEventListener('resize', this.getWidth)
  },
  unmounted () {
    window.removeEventListener('resize', this.getWidth)
  },
  methods: {
    getWidth () {
      this.width = this.$refs.optionsContainer.clientWidth
      if (this.optionsWidthArray.length === this.options.length && this.width > 0) {
        this.computeVisibleOptions()
      }
    },
    addOptionSize (size, index) {
      this.optionsWidthArray[index] = size
      if (this.optionsWidthArray.length === this.options.length && this.width > 0) {
        this.computeVisibleOptions()
      }
    },
    computeVisibleOptions () {
      let cumulateWidth = 0
      const widthToNotOverride = this.hiddenOptions.length > 0 ? this.width - 50 : this.width // 50 is for hiddenItem width
      const computedVisibleOptions = []
      const computedHiddenOptions = []
      for (let i = 0; i < this.options.length; i++) {
        cumulateWidth += this.optionsWidthArray[i] + 30 // 30 is for margins
        if (cumulateWidth < widthToNotOverride) {
          computedVisibleOptions.push(this.options[i])
        } else {
          computedHiddenOptions.push(this.options[i])
        }
      }
      this.visibleOptions = computedVisibleOptions
      this.hiddenOptions = computedHiddenOptions
    },
    emitOption (option) {
      this.$emit('optionClicked', option)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.current-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
}

</style>
