<template>
  <div
    ref="optionsContainer"
    class="current-options"
    :class="{'phone': mq.phone}"
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
import HiddenItems from '@components/Base/HiddenItems'
import OptionItem from '@components/Documents/OptionItem'

export default {
  name: 'Options',
  components: { HiddenItems, OptionItem },
  inject: ['mq'],
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
      if (this.mq.phone) {
        if (this.visibleOptions && this.visibleOptions.length && this.visibleOptions[0].name === 'new') {
          this.hiddenOptions = this.visibleOptions.slice(1, this.visibleOptions.length)
          this.visibleOptions = [this.visibleOptions[0]]
        }
      }
    }
  },
  mounted () {
    this.getWidth()
    if (this.mq.phone) {
      if (this.visibleOptions && this.visibleOptions.length && this.visibleOptions[0].name === 'new') {
        this.hiddenOptions = this.visibleOptions.slice(1, this.visibleOptions.length)
        this.visibleOptions = [this.visibleOptions[0]]
      }
    } else {
      window.addEventListener('resize', this.getWidth)
    }
  },
  unmounted () {
    if (!this.mq.phone) {
      window.removeEventListener('resize', this.getWidth)
    }
  },
  methods: {
    getWidth () {
      this.width = this.$refs.optionsContainer.clientWidth
      if (this.optionsWidthArray.length === this.options.length && this.width > 0) {
        this.computeVisibleOptions()
      }
    },
    addOptionSize (size, index) {
      if (!this.mq.phone) {
        this.optionsWidthArray[index] = size
        if (this.optionsWidthArray.length === this.options.length && this.width > 0) {
          this.computeVisibleOptions()
        }
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
  overflow: visible;

  &.phone {
    padding-left: 5px;
    justify-content: space-between;
  }
}
</style>
