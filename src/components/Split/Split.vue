<template>
  <div class="split">
    <slot/>
  </div>
</template>

<script>
import split from 'split.js'

export default {
  name: 'Split',
  props: {
    autoresize: {
      type: Boolean,
      default: false
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
          'background-color': 'orange',
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
  data () {
    return {
      elements: [],
      sizes: [],
      minSizes: [],
      instance: undefined
    }
  },
  watch: {
    'direction' (val) {
      this.init()
    },
    'gutterSize' (val) {
      this.init()
    }
  },
  methods: {
    init () {
      var vm = this
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
          /*
            menu gutter
            position: relative;
            z-index: 6;
            background-color: #f1f1f1;
            box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.19);
          */
          var stylesheet = JSON.parse(JSON.stringify(vm.gutterStylesheet))
          stylesheet[dimension] = gutterSize + 'px'
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
      this.elements.push(item.$el)
      this.sizes.push(item.size)
      this.minSizes.push(item.minSize)
      this.init()
    },
    removeArea (item) {
      var index = this.elements.indexOf(item.$el)
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
  height: 100%;
  width: 100%;
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
