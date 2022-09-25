<template>
  <div class="split">
    <slot />
  </div>
</template>

<script>
import split from 'split.js'

export default {
  name: 'Split',
  props: {
    autoresize: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    gutterSize: {
      type: Number,
      default: 5
    },
    gutterStylesheet: {
      type: Object,
      default () {
        return {
          background: 'linear-gradient(to right, #CFD5DA, #F3F6F8)',
          'background-repeat': 'no-repeat',
          'background-position': '50%'
        }
      }
    },
    snapOffset: {
      type: Number,
      default: 0
    }
  },
  emits: ['onDrag', 'onDragStart', 'onDragEnd'],
  data () {
    return {
      elements: [],
      sizes: [],
      minSizes: [],
      instance: undefined
    }
  },
  computed: {
    realGutterSize () { // gutterSize + margins
      return this.gutterSize + 6
    }
  },
  watch: {
    'direction' (val) {
      this.init()
    },
    'gutterSize' (val) {
      this.init()
    },
    'sizes' (val) {
      this.init()
    }
  },
  methods: {
    init () {
      const vm = this
      if (vm.instance !== undefined) {
        vm.instance.destroy()
      }
      vm.instance = undefined
      vm.instance = split(vm.elements, {
        direction: vm.direction,
        sizes: vm.sizes,
        minSize: vm.minSizes,
        gutterSize: vm.gutterSize,
        snapOffset: vm.snapOffset,
        cursor: (vm.direction === 'horizontal') ? 'col-resize' : 'row-resize',
        gutterStyle (dimension, gutterSize) {
          const stylesheet = JSON.parse(JSON.stringify(vm.gutterStylesheet))
          stylesheet[dimension] = (gutterSize) + 'px'
          // stylesheet['margin-left'] = '3px'
          // stylesheet['margin-right'] = '3px'
          return stylesheet
        },
        onDrag () {
          vm.$emit('onDrag', vm.instance.getSizes())
        },
        onDragStart () {
          vm.$emit('onDragStart', vm.instance.getSizes())
        },
        onDragEnd (str) {
          vm.$emit('onDragEnd', vm.instance.getSizes())
        }
      })
    },
    addArea (item) {
      if (item.index !== undefined) {
        this.elements.splice(item.index, 0, item.$el)
        this.sizes.splice(item.index, 0, item.size)
        this.minSizes.splice(item.index, 0, item.minSize)
      } else {
        this.elements.push(item.$el)
        this.sizes.push(item.size)
        this.minSizes.push(item.minSize)
      }
      this.init()
    },
    removeArea (item) {
      const index = this.elements.indexOf(item.$el)
      if (this.autoresize && this.elements.length > 1) {
        if (index > 0) {
          this.sizes[index - 1] += this.sizes[index]
        } else {
          this.sizes[index + 1] += this.sizes[index]
        }
      }
      this.elements.splice(index, 1)
      this.sizes.splice(index, 1)
      this.minSizes.splice(index, 1)
      if (this.elements.length > 0) {
        this.init()
      }
    },
    reset () {
      this.init()
    },
    getSizes () {
      return this.instance.getSizes()
    }
  }
}
</script>

<style lang="scss">
.split {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.gutter.gutter-vertical {
  cursor: row-resize;
  // background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}

.gutter.gutter-horizontal {
  cursor: col-resize;
  height: 100%;
  display: inline-block;
}
</style>
