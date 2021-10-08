<template>
  <div
    class="tree-item"
    :class="{'selected': isSelected }"
    @click="selectItem"
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
  span {
    margin-left: 5px;
    font-family: Roboto;
    font-size: 12px;
    &.selected {
      color: #306CD3;
    }
  }
}
</style>

<i18n locale="fr">
{
}
</i18n>
