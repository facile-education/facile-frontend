<template>
  <div class="access-create-button">
    <WeprodeButton
      class="create-button"
      data-test="createAccessButton"
      @click="clickNew"
    >
      <CustomIcon icon-name="icon-plus" />
      <span v-t="'Accesses.AccessCreateButton.new'" />
    </WeprodeButton>

    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      data-test="containerCreateAccessButtons"
      :is-absolute="true"
      @choose-option="optionClicked"
      @close="isContextMenuDisplayed=false"
    />
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import ContextMenu from '@components/ContextMenu/ContextMenu.vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'AccessCreateButton',
  components: { CustomIcon, ContextMenu, WeprodeButton },
  emits: ['createCategory', 'createAccess'],
  data () {
    return {
      isContextMenuDisplayed: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    canCreateAccess () {
      return this.categoryList.length > 0
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    createMenu () {
      const options = [
        {
          name: 'createCategory',
          i18nKey: 'Accesses.AccessCreateButton.category',
          position: 0,
          hasSeparator: false
        }
      ]
      if (this.canCreateAccess) {
        options.push(
          {
            name: 'createAccess',
            i18nKey: 'Accesses.AccessCreateButton.access',
            position: 1,
            hasSeparator: false
          }
        )
      }
      return options
    }
  },
  methods: {
    clickNew (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isContextMenuDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event,
            options: this.createMenu
          })
      }
    },
    optionClicked (option) {
      switch (option.name) {
        case 'createCategory':
          this.$emit('createCategory')
          break
        case 'createAccess':
          this.$emit('createAccess')
          break
        default:
          console.error('unknown action for option', option)
      }
      this.isContextMenuDisplayed = false
      this.$store.dispatch('contextMenu/closeMenus')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.access-create-button {
  position: relative;
}

.create-button {
  @extend %create-button;
}

</style>
