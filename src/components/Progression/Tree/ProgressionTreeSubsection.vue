<template>
  <div
    class="tree-subsection"
  >
    <!-- Subsection name -->
    <p
      @click="selectSubsection"
    >
      SUB{{ subSection.name }}
    </p>

    <!-- Sub-section items -->
    <div
      v-if="isExpanded"
      class="tree-items"
    >
      <ProgressionTreeItem
        v-for="item in subSection.items"
        :key="item.itemId"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import ProgressionTreeItem from '@/components/Progression/Tree/ProgressionTreeItem'

export default {
  name: 'ProgressionTreeSubsection',
  components: { ProgressionTreeItem },
  props: {
    subSection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isExpanded: true
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    }
  },
  created () {
    this.isExpanded = false
  },
  methods: {
    expand () {
      this.isExpanded = !this.isExpanded
    },
    selectSubsection () {
      this.$store.dispatch('progression/setCurrentFolder', this.subSection)
      this.expand()
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-section {
  margin-left: 10px;
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
