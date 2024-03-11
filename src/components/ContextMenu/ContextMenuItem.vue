<template>
  <div>
    <button
      class="context-menu-item"
      :class="{'has-separator': option.hasSeparator,
               'is-grayed': option.isGrayed,
               'hoverable': !option.isGrayed,
               'active': isActive,
               'theme-background-color': isActive,
               'is-selected theme-light-background-color': isSelected}"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @click.stop="emitOption"
      @dblclick.stop=""
      @dragover="setActive"
      @dragleave="cancelActive"
      @drop="dropFile"
    >
      <span
        v-if="option.hasCheckbox"
        class="checkbox"
      >
        <CustomIcon
          v-if="option.isSelected"
          icon-name="icon-check"
        />
      </span>
      <span class="title">
        {{ $t(option.i18nKey) }}
      </span>
      <span
        v-if="option.icon"
        class="icon"
      >
        <img
          v-if="isIconImage"
          :src="option.icon"
          :alt="$t(option.i18nKey)"
        >
        <CustomIcon
          v-else
          class="custom-icon"
          :icon-name="option.icon"
        />
      </span>
      <CustomIcon
        v-if="hasSubMenu"
        class="sub-menu-chevron"
        icon-name="icon-chevron-right-s"
      />
    </button>
    <ContextMenu
      v-if="isSubMenuDisplay"
      :sub-menu-mobile="mq.phone"
      :is-sub-menu="true"
      :list-options="option.subMenu"
      :menu-position="subMenuPosition"
      @choose-option="emitSubOption"
      @close="emitCloseOrder"
    />
  </div>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'
const ContextMenu = defineAsyncComponent(() => import('@components/ContextMenu/ContextMenu'))

export default {
  name: 'ContextMenuItem',
  components: {
    CustomIcon,
    ContextMenu
  },
  inject: ['mq'],
  props: {
    option: {
      type: Object,
      required: true
    },
    isHoverable: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
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
      isActive: false,
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
      return this.option.subMenu && this.option.subMenu.length !== 0
    },
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    },
    isIconImage () {
      return this.option.icon?.indexOf('svg') !== -1
    }
  },
  watch: {
    isaSubMenuDisplayed (value) {
      if (!value && this.wantsToDeploy) {
        this.wantsToDeploy = false
        this.$store.dispatch('contextMenu/setAskForDeploySubMenu', false)
        this.deploySubMenu()
      }
    },
    isAskingForDeploySubMenu (value) {
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
      const menuItemHeight = 40
      const subMenuHeight = this.option.subMenu.length * menuItemHeight - 2
      if (this.position.y + subMenuHeight > window.innerHeight - 10) {
        return this.position.y - subMenuHeight + menuItemHeight
      } else {
        return this.position.y
      }
    },
    cancelHandlers (e) {
      e.preventDefault()
      // e.stopPropagation()
    },
    setActive (e) {
      if (this.option.isHoverable && this.isThereInternDocumentDrag) {
        this.isActive = true
        this.cancelHandlers(e)
      }
    },
    cancelActive (e) {
      if (this.option.isHoverable && this.isThereInternDocumentDrag) {
        this.isActive = false
        this.cancelHandlers(e)
      }
    },
    dropFile (e) {
      if (this.option.isHoverable && this.isThereInternDocumentDrag) {
        this.cancelActive(e)
        // dropFileAction
        this.option.dropMethod(e, this.option)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

button {
  width: 100%;
  cursor: pointer;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;

  &:not(.active) {
    background-color: transparent;
  }
}

.context-menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 40px;
  padding: 0 20px;

  .title {
    padding: 0 10px;
    font-size: 0.9375em;
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

    .custom-icon {
      font-size: 18px;
    }
  }

  &:hover, &.is-selected {
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

  .sub-menu-chevron {
    font-size: 1.2rem;
    margin-left: 10px;
  }

</style>
