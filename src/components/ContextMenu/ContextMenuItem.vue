<template>
  <li>
    <div
      class="context-menu-item"
      :class="{'has-separator': hasSeparator,
               'is-grayed': isGrayed,
               'hoverable': !isGrayed}"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @click.stop="emitOption"
      @dblclick.stop=""
    >
      <div
        v-if="hasCheckbox"
        class="checkbox"
      >
        <BaseIcon
          v-if="isSelected"
          name="check"
        />
      </div>
      <div class="title">
        {{ title }}
      </div>
      <div
        v-if="icon !== ''"
        class="icon"
      >
        <img
          v-if="iconWhite === undefined || !isHovering"
          :src="icon"
          :alt="title"
        >
        <img
          v-show="iconWhite !== undefined && isHovering"
          :src="iconWhite"
          :alt="title"
        >
      </div>
      <BaseIcon
        v-if="hasSubMenu"
        class="sub-menu-chevron"
        name="chevron-right"
      />
    </div>
    <ContextMenu
      v-if="isSubMenuDisplay"
      :sub-menu-mobile="mq.phone"
      :is-sub-menu="true"
      :list-options="subMenu"
      :menu-position="subMenuPosition"
      @chooseOption="emitSubOption"
      @close="emitCloseOrder"
    />
  </li>
</template>

<script>

import BaseIcon from '@components/Base/BaseIcon'
import { defineAsyncComponent } from 'vue'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu'))

export default {
  name: 'ContextMenuItem',
  components: {
    BaseIcon,
    ContextMenu
  },
  inject: ['mq'],
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconWhite: {
      type: String,
      default: undefined
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isGrayed: {
      type: Boolean,
      default: false
    },
    hasCheckbox: {
      type: Boolean,
      default: false
    },
    hasSeparator: {
      type: Boolean,
      default: false
    },
    subMenu: {
      type: Array,
      default: function () {
        return []
      }
    },
    position: {
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
  emits: ['isContextMenuMobileExtended', 'selectOption', 'close', 'emitSubOption'],
  data () {
    return {
      wantsToDeploy: false,
      isSubMenuDisplay: false,
      isHovering: false,
      subMenuPosition: { x: 0, y: 0 }
    }
  },
  computed: {
    isaSubMenuDisplayed () {
      return this.$store.state.contextMenu.isSubMenuDisplay
    },
    isAskingForDeploySubMenu () {
      return this.$store.state.contextMenu.askForDeploySubMenu
    },
    hasSubMenu () {
      return this.subMenu.length !== 0
    }
  },
  watch: {
    isaSubMenuDisplayed (value, oldValue) {
      if (!value && this.wantsToDeploy) {
        this.wantsToDeploy = false
        this.$store.dispatch('contextMenu/setAskForDeploySubMenu', false)
        this.deploySubMenu()
      }
    },
    isAskingForDeploySubMenu (value, oldValue) {
      if (value && this.isSubMenuDisplay) {
        this.isSubMenuDisplay = false
        this.$store.dispatch('contextMenu/setIsSubMenuDisplay', false)
      }
    }
  },
  methods: {
    emitOption () {
      if (this.hasSubMenu) {
        if (!this.isaSubMenuDisplayed) {
          this.deploySubMenu()
        } else {
          this.wantsToDeploy = true
          this.$store.dispatch('contextMenu/setAskForDeploySubMenu', true)
        }
      } else {
        this.$emit('selectOption')
      }
    },
    deploySubMenu () {
      this.isSubMenuDisplay = !this.isSubMenuDisplay
      if (this.isSubMenuDisplay && this.mq.phone) { // To be able to know in context menu if there is a subMenuMobile
        this.$emit('isContextMenuMobileExtended', true)
      } else {
        this.$emit('isContextMenuMobileExtended', false)
      }
      if (this.isSubMenuDisplay) {
        this.$store.dispatch('contextMenu/setIsSubMenuDisplay', true)
        this.subMenuPosition = { x: this.computeXPosition(), y: this.computeYPosition() }
      }
    },
    emitCloseOrder () {
      this.$emit('close')
    },
    emitSubOption (optionName) {
      this.$emit('emitSubOption', optionName)
    },
    computeXPosition () {
      const menuWidth = 300
      if (this.position.x + 2 * menuWidth > window.innerWidth - 10) {
        return this.position.x - menuWidth
      } else {
        return this.position.x + menuWidth
      }
    },
    computeYPosition () {
      const subMenuHeight = this.subMenu.length * 54 - 2
      if (this.position.y + subMenuHeight > window.innerHeight - 10) {
        return this.position.y - subMenuHeight + 54
      } else {
        return this.position.y
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.context-menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 54px;

  .title {
    margin-top: 5px;
    padding: 10px;
    margin-bottom: 5px;
    font-size: 0.9375em;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    margin-left: auto;
    height: 33px;
    width: 33px;
    min-width: 33px;
    border-radius: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-not-white-bg;

    img {
      width: 15px;
      height: 18px;
    }
  }

  &:hover {
    .title {
      color: black;
    }

    .icon {
      background-color: $color-hover-bg;
    }

    .sub-menu-chevron{
      color: black;
    }
  }
}

  .is-grayed{
    color: gray;
  }

  .has-separator{
    border-bottom: 1px solid $color-border;
  }

  .checkbox{
    width: 25px;
    text-align: center;
  }

  .sub-menu-chevron{
    margin-left: 10px;
  }

</style>
