<template>
  <div
    class="tree-item"
    :class="{'selected': isSelected }"
    @click="selectItem"
  >
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

    <span>{{ item.name }}</span>
  </div>
</template>

<script>

export default {
  name: 'ProgressionTreeItem',
  components: { },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isSelected () {
      return this.$store.state.progression.currentItem !== undefined && this.$store.state.progression.currentItem.itemId === this.item.itemId
    }
  },
  created () {
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
  height: 25px;
  &:hover {
    background-color: #EFF3FB;
  }
  .item-type-icon {
    width: 20px;
    height: 20px;
    margin: auto;
    float: left;
  }
  span {
    margin: auto;
    margin-left: 5px;
    font-family: Roboto;
    font-size: 12px;
    float: left;
    &.selected {
      color: #306CD3;
    }
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir"
}
</i18n>
