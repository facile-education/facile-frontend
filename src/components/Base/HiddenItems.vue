<template>
  <div
    ref="hiddenItems"
    class="container"
    @click="handleClick"
  >
    <div class="dots">
      ...
    </div>
  </div>

  <ContextMenu
    v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
    @chooseOption="subMenuOptionClicked"
    @close="isContextMenuDisplayed=false"
  />
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
    }
  },
  emits: ['optionClicked'],
  data () {
    return {
      isContextMenuDisplayed: false
    }
  },
  computed: {
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    }
  },
  methods: {
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

.container {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .dots {

    font-size: 20px;
  }
}

</style>
