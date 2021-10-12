<template>
  <div>
    <ul
      id="context-menu"
      data-test="context-menu"
      :class="{
        'context-menu': !subMenuMobile,
        'sub-menu-mobile': subMenuMobile,
        'desktop-menu': !mq.phone,
        'context-menu-mobile-extended': isContextMenuMobileExtended
      }"
    >
      <!-- TODO pass only one argument as an object-->
      <ContextMenuItem
        v-for="option in options"
        :key="option.position"
        :data-test="option.name"
        :title="option.title"
        :icon="option.icon"
        :icon-white="option.iconWhite"
        :is-selected="option.isSelected"
        :is-grayed="option.isGrayed"
        :has-checkbox="option.hasCheckbox"
        :has-separator="option.hasSeparator"
        :sub-menu="option.subMenu"
        :position="{x: position.x, y: position.y + option.position*54}"
        @selectOption="emitOption(option.name)"
        @isContextMenuMobileExtended="subMenuMobileManagement"
        @emitSubOption="emitOption"
        @close="closeMenu"
      />
    </ul>
  </div>
</template>

<script>
import ContextMenuItem from '@/components/ContextMenu/ContextMenuItem'
import _ from 'lodash'

export default {
  name: 'ContextMenu',
  components: { ContextMenuItem },
  inject: ['mq'],
  props: {
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
  emits: ['close', 'chooseOption'],
  data () {
    return {
      isContextMenuMobileExtended: false
    }
  },
  computed: {
    position () {
      if (this.isSubMenu) {
        return _.orderBy(this.MenuPosition, 'position', 'asc')
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
    const computedPosition = { x: this.computeXPosition(this.position.x), y: this.computeYPosition(this.position.y) }
    menu.style.left = computedPosition.x.toString() + 'px'
    menu.style.top = computedPosition.y.toString() + 'px'
    // update computed position in store
    if (!this.isSubMenu) { this.$store.dispatch('contextMenu/setContextMenuPosition', computedPosition) }

    window.addEventListener('click', this.clickOutside)
    window.addEventListener('contextmenu', this.clickOutside) // right click
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
    window.removeEventListener('contextmenu', this.clickOutside)
    // To by sure that it will close
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
    computeXPosition (left) {
      const largestWidth = window.innerWidth - 300 - 10
      if (left > largestWidth) left = largestWidth
      return left
    },
    computeYPosition (top) {
      const menuHeight = this.options.length * 54 + 2 // items padding + border
      const largestHeight = this.mq.phone
        ? window.innerHeight - menuHeight - 48 - 10 // 48 px is $mobile-menu-height, because we don't want the context menu go beside
        : window.innerHeight - menuHeight - 10
      if (top > largestHeight) top = largestHeight
      return top
    },
    emitOption (optionName) {
      let isSubOption = true
      for (let i = 0; i < this.options.length; ++i) { // if the option selected are not grayed
        if (this.options[i].name === optionName) {
          isSubOption = false
          if (!this.options[i].isGrayed) {
            this.$emit('chooseOption', optionName)
          }
          break
        }
      }
      if (isSubOption) { // it's not my role to check if the option is grayed
        this.$emit('chooseOption', optionName)
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
     position: fixed;
     z-index: $context-menu-z-index;
     display: flex;
     flex-direction: column;
     width: 300px;
     padding: 0 20px;
     margin: 0;
     list-style: none;
     background: white;
     box-shadow: 0 2px 14px 0 rgba(0,0,0,0.1);

     /* disable text selection on documents (not convenient when shift-select) */
     -ms-user-select: none;
     -moz-user-select: none;
     -webkit-user-select: none;
     user-select: none; /* CSS3 (little to no support) */
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
