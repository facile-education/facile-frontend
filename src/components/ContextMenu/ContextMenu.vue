<template>
  <div @click.right.prevent>
    <ul
      id="context-menu"
      data-test="context-menu"
      :class="{
        'absolute': isAbsolute,
        'context-menu': !subMenuMobile,
        'sub-menu-mobile': subMenuMobile,
        'desktop-menu': !mq.phone,
        'context-menu-mobile-extended': isContextMenuMobileExtended
      }"
      tabindex="-1"
      @keydown.stop.up="onUpKey"
      @keydown.stop.down="onDownKey"
      @keydown.stop.esc="closeMenu"
      @keydown.stop.enter="emitOption(options[selectedIndex])"
    >
      <!-- TODO pass only one argument as an object-->
      <ContextMenuItem
        v-for="option in options"
        :key="option.position"
        :data-test="option.name"
        :option="option"
        :position="{x: position.x, y: position.y + option.position*40}"
        :is-selected="selectedIndex !== undefined ? options[selectedIndex] === option : false"
        @selectOption="emitOption(option)"
        @isContextMenuMobileExtended="subMenuMobileManagement"
        @emitSubOption="emitOption"
        @close="closeMenu"
      />
    </ul>
  </div>
</template>

<script>
import ContextMenuItem from '@/components/ContextMenu/ContextMenuItem'

export default {
  name: 'ContextMenu',
  components: { ContextMenuItem },
  inject: ['mq'],
  props: {
    isAbsolute: {
      type: Boolean,
      default: false
    },
    isSubMenu: {
      type: Boolean,
      default: false
    },
    subMenuMobile: {
      type: Boolean,
      default: false
    },
    listOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    menuPosition: {
      type: Object,
      default: function () {
        return { x: 0, y: 0 }
      },
      validator: function (obj) {
        return (typeof obj.x === 'number') &&
               (typeof obj.y === 'number')
      }
    }
  },
  emits: ['close', 'chooseOption', 'dropFile'],
  data () {
    return {
      isContextMenuMobileExtended: false,
      selectedIndex: undefined
    }
  },
  computed: {
    position () {
      if (this.isSubMenu) {
        return this.menuPosition
      } else {
        return this.$store.state.contextMenu.contextMenuPosition
      }
    },
    options () {
      if (this.isSubMenu) {
        return this.listOptions
      } else {
        return this.$store.state.contextMenu.contextMenuOptions
      }
    },
    menuHeight () { // only used when contextMenuMobile is extended
      const menu = this.$el.querySelector('#context-menu')
      return menu.clientHeight
    }
  },
  created () {
    if (this.options.length === 0) {
      this.closeMenu()
    }
  },
  mounted () {
    const menu = this.$el.querySelector('#context-menu')
    if (!this.isAbsolute) {
      const computedPosition = { x: this.computeXPosition(this.position.x), y: this.computeYPosition(this.position.y) }
      menu.style.left = computedPosition.x.toString() + 'px'
      menu.style.top = computedPosition.y.toString() + 'px'
      // update computed position in store
      if (!this.isSubMenu) { this.$store.dispatch('contextMenu/setContextMenuPosition', computedPosition) }
    }

    window.addEventListener('click', this.clickOutside)
    window.addEventListener('contextmenu', this.clickOutside) // right click
    menu.focus()
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
    window.removeEventListener('contextmenu', this.clickOutside)
    // To be sure that it will close
    if (!this.isSubMenu) {
      this.closeMenu()
    }
  },
  methods: {
    clickOutside (e) {
      const self = this
      if (e.type === 'contextmenu') {
        this.closeMenu() // close the menu even if the right-click take place on the menu
      } else {
        if (self.$el.querySelector('#context-menu') && !self.$el.querySelector('#context-menu').contains(e.target)) {
          this.closeMenu()
        }
      }
    },
    closeMenu () {
      this.$store.dispatch('contextMenu/closeMenus')
      this.$emit('close')
    },
    drop (e, item) {
      if (this.isThereInternDocumentDrag && this.isHoverable) {
        this.$emit('dropFile', e, item)
      }
    },
    computeXPosition (left) {
      const largestWidth = window.innerWidth - 300 - 10
      if (left > largestWidth) left = largestWidth
      return left
    },
    computeYPosition (top) {
      const menuHeight = this.options.length * 40 + 2 // items padding + border
      const largestHeight = this.mq.phone
        ? window.innerHeight - menuHeight - 48 - 10 // 48 px is $mobile-menu-height, because we don't want the context menu go beside
        : window.innerHeight - menuHeight - 10
      if (top > largestHeight) top = largestHeight
      return top
    },
    emitOption (option) {
      let isSubOption = true
      for (let i = 0; i < this.options.length; ++i) { // if the option selected are not grayed
        if (this.options[i].name === option) {
          isSubOption = false
          if (!this.options[i].isGrayed) {
            this.$emit('chooseOption', option)
          }
          break
        }
      }
      if (isSubOption) { // it's not my role to check if the option is grayed
        this.$emit('chooseOption', option)
      }
    },
    onDownKey () {
      if (this.selectedIndex === undefined) {
        this.selectedIndex = 0
      } else {
        this.selectedIndex = (this.selectedIndex !== this.options.length - 1) ? this.selectedIndex + 1 : 0
      }
    },
    onUpKey () {
      if (this.selectedIndex === undefined) {
        this.selectedIndex = 0
      } else {
        this.selectedIndex = (this.selectedIndex !== 0) ? this.selectedIndex - 1 : this.options.length - 1
      }
    },
    subMenuMobileManagement (isContextMenuMobileExtended) {
      this.isContextMenuMobileExtended = isContextMenuMobileExtended
      const menu = this.$el.querySelector('#context-menu')
      if (isContextMenuMobileExtended) {
        menu.style.height = this.menuHeight.toString() + 'px' // hard set menu height to it previous size in pixels
      } else {
        menu.style.height = '' // menu height can again compute it size by default
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

 .context-menu {
   font-weight: normal;
   position: fixed;
   z-index: $context-menu-z-index;
   display: flex;
   flex-direction: column;
   width: 300px;
   padding: 0;
   margin: 0;
   list-style: none;
   background: white;
   box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);
   color: initial;

   /* disable text selection on documents (not convenient when shift-select) */
   user-select: none; /* CSS3 (little to no support) */

   &.absolute {
     position: absolute;
     left: 0;
     top: 100%;
   }

   &:focus {
     border: none;
   }
 }

 .sub-menu-mobile{
   z-index: $context-menu-z-index;
   display: block;
   width: 100%;
   padding-left: 15px;
   margin: 0;
   color: #555;
   list-style: none;
   background: #FAFAFA;
 }

 .context-menu-mobile-extended {
   overflow-x: hidden;
   overflow-y: scroll;
 }

</style>
