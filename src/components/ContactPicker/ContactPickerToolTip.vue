<template>
  <div
    ref="tooltip"
    class="contact-picker-tooltip"
  >
    <div class="header">
      <h2 v-t="'ContactPicker.ContactPickerToolTip.header'" />
    </div>

    <ContactPicker
      :selected-contacts="selectedContacts"
      :max-height="maxHeight"
      :min-height="minHeight"
      @add-contacts="$emit('addContacts', $event)"
      @remove-contacts="$emit('removeContacts', $event)"
    />
  </div>
</template>

<script>
import ContactPicker from '@components/ContactPicker/ContactPicker.vue'

export default {
  name: 'ContactPickerToolTip',
  components: { ContactPicker },
  props: {
    selectedContacts: {
      type: Array,
      required: true
    },
    createButton: {
      type: Object,
      required: true
    },
    initCoordinates: {
      type: Object,
      default: undefined
    }
  },
  emits: ['addContacts', 'removeContacts', 'close'],
  data () {
    return {
      maxHeight: undefined,
      minHeight: undefined
    }
  },
  computed: {
    hasAdvancedSearchPanel () {
      return !this.$store.state.user.isStudent && !this.$store.state.user.isParent
    },
    isUserCardModalDisplayed () {
      return this.$store.state.userCard.userToDisplay
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
    this.updatePosition()
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  updated () {
    this.updatePosition()
  },
  methods: {
    updatePosition () {
      if (this.initCoordinates) {
        //  Set x position
        this.$refs.tooltip.style.left = this.initCoordinates.x + 'px'

        // Set y position, prevent windows overflow
        const domRect = this.$refs.tooltip.getBoundingClientRect()
        const yOverflow = (this.initCoordinates.y + domRect.height) - window.innerHeight
        let top
        if (yOverflow > 0) {
          top = this.initCoordinates.y - yOverflow
        } else {
          top = this.initCoordinates.y
        }
        this.$refs.tooltip.style.top = top + 'px'

        // Compute new max-height
        const tabHeaderHeight = this.hasAdvancedSearchPanel ? 135 : 74
        this.maxHeight = Math.max(window.innerHeight - top - tabHeaderHeight - 50) + 'px' // 120 is the contact picker header, 50 in the margin to window bottom

        // Compute min-size too
        this.minHeight = this.initCoordinates.minHeight - tabHeaderHeight + 'px'
      }
    },
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target) && !this.isUserCardModalDisplayed && this.createButton.$el && !this.createButton.$el.contains(e.target) && e.target.parentNode !== null) {
        this.onClose()
      }
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.contact-picker-tooltip {
  position: fixed;
  width: 75vw;
  background-color: #FFFFFF;
  z-index: 10;
  border: 1px solid $color-border;
  padding: 14px 24px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;

  h2 {
    margin: 0;
    font-size: 1.3rem;
  }

  button {
    margin-left: 5px;
    background: none;
    border: none;
    height: 30px;
    width: 30px;
    font-size: 1.3rem;
    padding: 0;

    &:hover {
      cursor: pointer;
      background-color: rgba(220, 220, 220, 0.5);
    }
  }
}
</style>
