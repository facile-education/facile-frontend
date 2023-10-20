<template>
  <WeprodeWindow
    class="create-relation-modal"
    data-test="create-relation-modal"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <WeprodeDropdown
        v-model="selectedRelatedItem"
        class="item-list"
        :list="itemList"
        :sort="false"
        display-field="itemName"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('submit')"
        :disabled="selectedRelatedItem.itemId === 0"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'

import { getHelpMenu, saveRelation } from '@/api/help.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'CreateRelatedItemModal',
  components: { WeprodeButton, WeprodeDropdown, WeprodeWindow },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      selectedRelatedItem: { itemId: 0, itemName: 'Item' }, // TODO: Find a more satisfying way to do the dropdown placeholder
      itemList: []
    }
  },
  computed: {
    selectedHelpItem () {
      return this.$store.state.help.selectedItem
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.getItemList()
  },
  methods: {
    getItemList () {
      getHelpMenu('').then((data) => {
        if (data.success) {
          this.itemList = [] // Reset itemList
          // Browse categories to add items
          data.helpTree.forEach((category) => {
            category.items.forEach((item) => {
              if (item.itemId !== this.selectedHelpItem.itemId) {
                item.itemName = category.categoryName + ' - ' + item.itemName
                this.itemList.push(item)
              }
            })
          })
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    submit () {
      saveRelation(this.selectedHelpItem.itemId, this.selectedRelatedItem.itemId).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.item-list {
  width: 100%;
}
</style>

<i18n locale="fr">
{
  "title": "ÉDITER UNE RELATION",
  "submit": "Valider"
}
</i18n>
