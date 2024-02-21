<template>
  <div class="dropdown-button base-button button">
    <button
      class="main-button theme-background-color"
      @click="$emit('click', selectedOption)"
    >
      <span v-if="selectedOption">{{ selectedOption.title }}</span>
    </button>

    <button
      class="toggle-options-list-button theme-background-color"
      @click.stop="displayOptionList=!displayOptionList"
      @keydown.stop.prevent.up="onUpKey"
      @keydown.stop.prevent.down="onDownKey"
      @keydown.stop.enter="onEnter"
      @keydown.stop
    >
      <CustomIcon icon-name="icon-chevron-right-s" />
    </button>

    <WeprodeAutocomplete
      v-if="displayOptionList"
      class="option-list"
      :list="options"
      display-field="title"
      :filtered="false"
      :highlighted-index="highlightedIndex"
      @select="optionClicked"
      @close="onClose"
    />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeAutocomplete from '@components/Base/Weprode/WeprodeAutocomplete.vue'

export default {
  name: 'WeprodeDropdownButton',
  components: { CustomIcon, WeprodeAutocomplete },
  props: {
    options: {
      type: Array,
      required: true
    },
    initialOption: {
      type: Object,
      default: undefined
    }
  },
  emits: ['click'],
  data () {
    return {
      selectedOption: undefined,
      displayOptionList: false,
      highlightedIndex: -1
    }
  },
  created () {
    if (this.initialOption) {
      this.selectedOption = this.initialOption
    } else if (this.options.length > 0) {
      this.selectedOption = this.options[0]
    }
  },
  methods: {
    optionClicked (option) {
      this.selectedOption = option
      this.displayOptionList = false
      this.$emit('click', this.selectedOption)
    },
    onDownKey () {
      if (this.highlightedIndex === this.options.length - 1) {
        this.highlightedIndex = 0
      } else {
        this.highlightedIndex++
      }
    },
    onUpKey () {
      if (this.highlightedIndex < 1) {
        this.highlightedIndex = (this.options.length - 1)
      } else {
        --this.highlightedIndex
      }
    },
    onEnter (e) {
      if (this.displayOptionList && this.highlightedIndex > -1) {
        e.preventDefault()
        e.stopPropagation()
        this.optionClicked(this.options[this.highlightedIndex])
      }
    },
    onClose (e) {
      if (this.displayOptionList && e && e.type === 'keydown') {
        e.stopPropagation()
      }
      this.displayOptionList = false
      this.highlightedIndex = -1
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.dropdown-button {
  position: relative;
  text-align: left;
  display: flex !important;
  padding: 0 !important;
}

.main-button, .toggle-options-list-button {
  height: 100%;
  padding: 15px;
  margin: 0;
  border: none;
  cursor: pointer;

  &:hover {
    filter: brightness(115%);
    @include transition(filter, 0.2s, linear);
  }
}

.main-button {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.toggle-options-list-button {
  display: flex;
  border-left: 1px solid white;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
}

.option-list {
  text-align: left;
}

.icon-chevron-right-s {
  transform: rotate(90deg);
}

</style>
