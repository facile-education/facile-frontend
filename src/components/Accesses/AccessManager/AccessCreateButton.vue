<template>
  <div class="access-create-button">
    <WeprodeButton
      class="create-button"
      data-test="createMessageButton"
      @click="clickNew"
    >
      <NeroIcon
        name="fa-plus"
      />
      <span v-t="'new'" />
    </WeprodeButton>

    <ContextMenu
      v-if="isContextMenuDisplayed && isAContextMenuDisplayed"
      :is-absolute="true"
      @choose-option="optionClicked"
      @close="isContextMenuDisplayed=false"
    />
  </div>
</template>

<script>
import ContextMenu from '@components/ContextMenu/ContextMenu.vue'
import NeroIcon from '@components/Nero/NeroIcon.vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'AccessCreateButton',
  components: { ContextMenu, NeroIcon, WeprodeButton },
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
          title: this.$t('category'),
          position: 0,
          hasSeparator: false
        }
      ]
      if (this.canCreateAccess) {
        options.push(
          {
            name: 'createAccess',
            title: this.$t('access'),
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

<i18n locale="fr">
{
  "category": "Categorie",
  "access": "Accès",
  "new": "Nouveau"
}
</i18n>
