<template>
  <div v-if="isAdministrator || relatedArticles.length > 0">
    <h3>
      {{ $t('HelpModal.RelatedItems.related-articles') }}
      <CustomIcon
        v-if="isAdministrator"
        icon-name="icon-plus"
        @click="isCreateRelatedItemModalDisplayed=true"
      />
    </h3>
    <ul>
      <li
        v-for="(relatedArticleItem, index) in relatedArticles"
        :key="index"
      >
        <a
          href="#"
          @click="selectItem(relatedArticleItem)"
        >{{ relatedArticleItem.relatedItemName }}</a>
        <CustomIcon
          v-if="isAdministrator"
          icon-name="icon-trash"
          @click="confirmRelationRemoval(relatedArticleItem)"
        />
      </li>
    </ul>
  </div>

  <teleport to="body">
    <CreateRelatedItemModal
      v-if="isCreateRelatedItemModalDisplayed"
      @close="isCreateRelatedItemModalDisplayed=false"
    />
  </teleport>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'

import { deleteRelation } from '@/api/help.service'
const CreateRelatedItemModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/CreateRelatedItemModal.vue'))

export default {
  name: 'RelatedItems',
  components: { CustomIcon, CreateRelatedItemModal },
  props: {
    relatedArticles: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isCreateRelatedItemModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  methods: {
    selectItem (relatedItem) {
      this.$store.dispatch('help/selectItem', relatedItem.relatedItemId)
    },
    confirmRelationRemoval (relatedArticleItem) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('HelpModal.RelatedItems.confirmRelationRemovalMessage'),
        lastAction: { fct: this.deleteRelation, params: [relatedArticleItem] }
      })
    },
    deleteRelation (relatedArticleItem) {
      deleteRelation(relatedArticleItem.relationId).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
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

h3 {
  margin-top: 0.5rem;
  text-transform: uppercase;
  border-bottom: 1px solid $color-border;
  color: $color-grey-text;
  font-weight: bold;
  padding-bottom: 1em;
  font-size: 0.75em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    .icon-plus {
      cursor: pointer;
      opacity: 100%;
    }
  }

  .icon-plus {
    font-size: 1.25rem;
    opacity: 0;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: $color-hover-bg;

    .icon-trash {
      opacity: 100%;
      cursor: pointer;
    }
  }
}

a {
  flex: 1;
  height: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 0.813em;
  color: black;
  text-decoration: none;
  line-height: 1;
}

.icon-trash {
  opacity: 0;
}
</style>
