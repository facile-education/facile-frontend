<template>
  <div
    class="tree-section"
  >
    <hr>
    <!-- Section name -->
    <p
      @click="selectSection"
    >
      {{ section.name }}
    </p>

    <!-- Sub-sections -->
    <div
      v-if="isExpanded"
      class="sub-sections"
    >
      <ProgressionTreeSubsection
        v-for="subSection in section.subSections"
        :key="subSection.folderId"
        :sub-section="subSection"
      />
    </div>
    <div
      v-if="isExpanded"
      class="items"
    >
      <ProgressionTreeItem
        v-for="item in section.items"
        :key="item.itemId"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import ProgressionTreeSubsection from '@/components/Progression/Tree/ProgressionTreeSubsection'
import ProgressionTreeItem from '@/components/Progression/Tree/ProgressionTreeItem'

export default {
  name: 'ProgressionTreeSection',
  components: { ProgressionTreeSubsection, ProgressionTreeItem },
  props: {
    section: {
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
    this.isExpanded = true
  },
  methods: {
    expand () {
      this.isExpanded = !this.isExpanded
    },
    selectSection () {
      this.$store.dispatch('progression/setCurrentFolder', this.section)
      this.expand()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-section {
  margin-left: 10px;
  p {
    color: #000000;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 16px;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
