<template>
  <div class="help-menu-category">
    <button
      :class="{'selected': containsTheSelectedHelpItem, 'admin': isAdministrator}"
      :title="category.categoryName"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
      @click="toggleCategoryExtension"
    >
      {{ category.categoryName }}
      <span v-if="isAdministrator && isHovering">
        <CustomIcon
          data-test="admin-create-category-button"
          icon-name="icon-plus"
          @click.stop="isCreateArticleModalDisplayed=true"
        />
        <CustomIcon
          data-test="admin-delete-category-button"
          icon-name="icon-trash"
          @click.stop="confirmCategoryRemoval"
        />
      </span>
    </button>
    <nav
      :class="isCategoryExtended ? 'extended' : 'collapsed'"
    >
      <ul>
        <li
          v-for="(item, index) in category.items"
          :key="index"
        >
          <HelpMenuItem
            :item="item"
            :is-first="index===0"
            :is-last="index===category.items.length - 1"
            @update-item-position="updateItemPosition"
          />
        </li>
      </ul>
    </nav>

    <teleport
      v-if="isCreateArticleModalDisplayed"
      to="body"
    >
      <CreateArticleModal
        :parent-category="category"
        @close="isCreateArticleModalDisplayed=false"
      />
    </teleport>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import HelpMenuItem from '@components/HelpModal/HelpMenuItem.vue'
import { defineAsyncComponent } from 'vue'

import { deleteCategory, saveHelpItemPosition } from '@/api/help.service'
const CreateArticleModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/CreateArticleModal.vue'))
export default {
  name: 'HelpMenuCategory',
  components: { CustomIcon, CreateArticleModal, HelpMenuItem },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isCategoryExtended: false,
      isCreateArticleModalDisplayed: false,
      isHovering: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    selectedHelpItem () {
      return this.$store.state.help.selectedItem
    },
    containsTheSelectedHelpItem () {
      return this.selectedHelpItem && this.category.items.map(item => item.itemId).indexOf(this.selectedHelpItem.itemId) !== -1
    },
    isSearchResult () {
      return this.$store.state.help.isSearchResult
    }
  },
  watch: {
    containsTheSelectedHelpItem: { // if selectedItem change and we must unfold: unfold
      immediate: true,
      handler () {
        if (this.containsTheSelectedHelpItem && !this.isCategoryExtended) {
          this.toggleCategoryExtension()
        }
      }
    },
    isSearchResult: { // Unfold when menu is search result and fold else (except for selected category)
      immediate: true,
      handler () {
        this.isCategoryExtended = this.isSearchResult || this.containsTheSelectedHelpItem
      }
    }
  },
  methods: {
    toggleCategoryExtension () {
      this.isCategoryExtended = !this.isCategoryExtended
    },
    confirmCategoryRemoval () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('HelpModal.HelpMenuCategory.confirmCategoryRemovalMessage'),
        lastAction: { fct: this.deleteCategory, params: [] }
      })
    },
    updateItemPosition (itemWithNewPos) {
      saveHelpItemPosition(this.category.categoryId, itemWithNewPos).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/getHelpMenu', { query: '' })
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    deleteCategory () {
      deleteCategory(this.category.categoryId).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/getHelpMenu', { query: '' })
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

.help-menu-category {
  border-bottom: 1px solid $color-border;
  overflow: hidden;

  &:last-child {
    border-bottom: none;
  }
}

button {
  height: 45px;
  width: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.813rem;
  line-height: 0;
  text-transform: uppercase;
  font-weight: 600;
  padding-left: 1rem;
  text-align: left;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;

  &.admin {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &.selected {
    background-color: $color-not-white-bg;
  }

  &:hover {
    background-color: $color-hover-bg;
  }

  span {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    gap: 8px;
  }

  img {
    margin-left: 10px;
  }
}

.collapsed {
  max-height: 0;
  transition: max-height 0.15s ease-out;
  overflow: hidden;
  background: #d5d5d5;
}

.extended {
  max-height: 500px;
  transition: max-height 0.35s ease-in;
}

ul {
  margin: 0;
  padding-left: 2rem;
  list-style-type: none;
}

</style>
