<template>
  <li
    class="menu-item"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <a
      :class="{'selected theme-text-color': isSelected}"
      href="#"
      @click="selectItem"
    >{{ item.itemName }}
      <span v-if="isAdministrator && isHovering">
        <BaseIcon
          class="arrow-up"
          name="arrow-up"
          @click.stop="updateItemPosition('up')"
        />
        <BaseIcon
          class="arrow-down"
          name="arrow-down"
          @click.stop="updateItemPosition('down')"
        />
        <img
          src="@/assets/icons/trash.svg"
          alt="delete"
          @click.stop="confirmItemRemoval"
        >
      </span>
    </a>
  </li>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'

import { deleteItem } from '@/api/help.service'

export default {
  name: 'HelpMenuItem',
  components: { BaseIcon },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['updateItemPosition'],
  data () {
    return {
      isHovering: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    isSelected () {
      return this.$store.state.help.selectedItem && this.$store.state.help.selectedItem.itemId === this.item.itemId
    }
  },
  methods: {
    selectItem () {
      this.$store.dispatch('help/selectItem', this.item.itemId)
      this.$store.dispatch('help/closeMobileMenu')
    },
    updateItemPosition (action) {
      const updatedItem = { ...this.item }
      if (action === 'up') {
        updatedItem.position = updatedItem.position - 1
      } else {
        updatedItem.position = updatedItem.position + 1
      }
      this.$emit('updateItemPosition', updatedItem)
    },
    confirmItemRemoval () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('confirmItemRemovalMessage'),
        lastAction: { fct: this.deleteItem, params: [] }
      })
    },
    deleteItem () {
      deleteItem(this.item.itemId).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/getHelpMenu', { query: '' })
          if (this.$store.state.help.currentArticle.itemId === this.item.itemId) {
            this.$store.dispatch('help/setSelectedItem', undefined)
          }
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

a {
  height: 28px;
  display: flex;
  align-items: center;
  font-size: 0.813em;
  text-decoration: none;
  font-weight: bold;
  justify-content: space-between;
  padding-right: 6px;
  line-height: 1;

  &:not(.selected) {
    color: black;
    font-weight: normal;
  }

  &:hover {
    background-color: $color-hover-bg;
  }

  .arrow-up, .arrow-down {
    margin-right: 5px;
  }
}

.menu-item:first-child {
  .arrow-up {
    display: none;
  }
}

.menu-item:last-child {
  .arrow-down {
    display: none;
  }
}

</style>

<i18n locale="fr">
{
  "confirmItemRemovalMessage": "Supprimmer l'article définitivement?"
}
</i18n>
