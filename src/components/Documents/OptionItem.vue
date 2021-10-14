<template>
  <div
    class="option-item"
    :title="option.title"
    @click="handleClick"
  >
    <img
      :src="option.icon"
      alt=""
    >
    <div class="title">
      {{ option.title }}
    </div>
    <img
      v-if="option.subMenu"
      class="arrow-down"
      src="@assets/arrow-down.svg"
      alt=""
    >
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
  name: 'OptionItem',
  components: { ContextMenu },
  props: {
    option: {
      type: Object,
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
      if (this.option.subMenu) {
        this.openSubMenu(event)
      } else {
        this.$emit('optionClicked', this.option)
      }
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
            options: this.option.subMenu
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.option-item {
  display: flex;
  cursor: pointer;
  align-items: center;
  height: 100%;
  margin: 0 15px;

  img {
    width: 28px;
    height: 28px;
    padding: 5px;
  }

  .title {
    font-size: 0.875em;
  }

  .arrow-down {
    width: 15px;
    height: 15px;
    padding: 0;
    margin-left: 10px;
  }

  &:hover {
    background-color: $color-hover-bg;
  }
}
</style>
