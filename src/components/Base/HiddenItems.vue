<template>
  <div
    ref="hiddenItems"
    class="container"
    :class="{ 'active': isActive}"
    @click="handleClick"
    @dragenter="setActive"
    @dragleave="cancelActive"
    @drop="dropFile"
  >
    <div class="dots">
      ...
    </div>

    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      @chooseOption="subMenuOptionClicked"
      @close="isContextMenuDisplayed=false"
    />
  </div>
</template>

<script>
import ContextMenu from '@components/ContextMenu/ContextMenu'

export default {
  name: 'HiddenItems',
  components: { ContextMenu },
  props: {
    items: {
      type: Array,
      required: true
    },
    isHoverable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['optionClicked'],
  data () {
    return {
      isContextMenuDisplayed: false,
      hoveringElementCount: 0
    }
  },
  computed: {
    isActive () {
      return this.hoveringElementCount > 0
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    }
  },
  methods: {
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      if (this.isThereInternDocumentDrag && this.isHoverable) {
        this.hoveringElementCount++
        this.openSubMenu(e)
        this.cancelHandlers(e)
      }
    },
    cancelActive (e) {
      if (this.isThereInternDocumentDrag && this.isHoverable) {
        this.hoveringElementCount--
        if (!this.isActive) {
          this.$store.dispatch('contextMenu/closeMenus')
          this.isContextMenuDisplayed = false
        }
        this.cancelHandlers(e)
      }
    },
    dropFile (e) {
      if (this.isThereInternDocumentDrag) {
        this.cancelActive(e)
      }
    },
    handleClick (event) {
      this.openSubMenu(event)
    },
    subMenuOptionClicked (option) {
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
      this.$emit('optionClicked', option)
    },
    openSubMenu (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event: event,
            options: this.items
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.container {
  width: 50px;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .dots {
    font-size: 20px;
  }

  &.active {
    background-color: $color-active-bg;
  }
}

</style>
