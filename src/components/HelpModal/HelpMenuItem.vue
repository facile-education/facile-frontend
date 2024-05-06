<template>
  <div
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
        <!-- todo: replace by arrow icon-->
        <CustomIcon
          v-if="!isFirst"
          icon-name="icon-chevron-right-s arrow-up"
          @click.stop="updateItemPosition('up')"
        />
        <CustomIcon
          v-if="!isLast"
          icon-name="icon-chevron-right-s arrow-down"
          class="reverse"
          @click.stop="updateItemPosition('down')"
        />
        <CustomIcon
          icon-name="icon-trash"
          @click.stop="confirmItemRemoval"
        />
      </span>
    </a>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

import { deleteItem } from '@/api/help.service'

export default {
  name: 'HelpMenuItem',
  components: { CustomIcon },
  props: {
    item: {
      type: Object,
      required: true
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
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
        text: this.$t('HelpModal.HelpMenuItem.confirmItemRemovalMessage'),
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

  span {
    color: black;
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    gap: 4px;

    .icon-chevron-right-s {
      transform: rotate(-90deg);

      &.reverse {
        transform: rotate(90deg);
      }
    }
  }
}

</style>
