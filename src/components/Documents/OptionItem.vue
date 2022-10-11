<template>
  <button
    ref="root"
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

    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      :is-absolute="true"
      @chooseOption="subMenuOptionClicked"
      @close="isContextMenuDisplayed=false"
    />
  </button>
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
  emits: ['optionClicked', 'addSize'],
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
  mounted () {
    this.$emit('addSize', this.$refs.root.clientWidth)
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
  position: relative;
  cursor: pointer;
  align-items: center;
  border-radius: 6px;
  padding: 0 5px;
  height: 100%;
  margin: 0 15px;
  background: none;
  border: none;

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
