<template>
  <div
    class="tree-item"
    :class="{'selected': isSelected }"
    :title="item.name"
    @click="selectItem"
  >
    <div class="icon">
      <img
        v-if="item.isHomework"
        class="item-type-icon"
        src="@assets/devoir.svg"
        :alt="$t('homework')"
        :title="$t('homework')"
      >
      <img
        v-else
        class="item-type-icon"
        src="@assets/seance.svg"
        :alt="$t('session')"
        :title="$t('session')"
      >
    </div>

    <span>{{ item.name }}</span>
  </div>
</template>

<script>

export default {
  name: 'ProgressionTreeItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isParentSectionSelected: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    currentItem () {
      return this.$store.state.progression.currentItem
    },
    isSelected () {
      // Item is selected when itself is selected or its parent section/subsection
      return (this.currentItem && this.currentItem.itemId === this.item.itemId) ||
              this.isParentSectionSelected
    }
  },
  methods: {
    selectItem () {
      this.$store.dispatch('progression/getItemContents', this.item)
      this.$store.dispatch('progression/setCurrentItem', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-item {
  display: flex;
  align-items: center;
  height: 30px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;

  &:hover {
    background-color: #EFF3FB;
  }
  &.selected {
    color: #306CD3;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 3px;
    margin-left: -3px;

    img {
      width: 22px;
      height: 22px;
    }
  }

  span {
    flex: 1;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.75rem;
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir"
}
</i18n>
