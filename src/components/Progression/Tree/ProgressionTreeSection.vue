<template>
  <div
    class="tree-section"
  >
    <hr>
    <!-- Section name -->
    <div
      class="section-name"
      :class="{'selected': isSelected }"
      @click="selectSection"
    >
      <span>{{ section.name }}</span>
    </div>

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
      class="section-items"
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
    },
    currentFolder () {
      return this.$store.state.progression.currentFolder
    },
    isSelected () {
      return this.currentFolder !== undefined && this.currentFolder.folderId === this.section.folderId
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
      // this.expand()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-section {
  margin-left: 10px;
  margin-right: 10px;

  hr {
    margin: 0;
    border: 0; border-top: 1px solid #D4D4D4;
  }

  .section-name {
    height: 30px;
    margin-top: 5px;
    margin-bottom: 5px;
    span {
      vertical-align: sub;
      margin-left: 5px;
      color: #000000;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 500;
    }

    &:hover {
      background-color: #EFF3FB;
    }
    &.selected span {
      color: #306CD3;
    }
    span {
      text-transform: uppercase;
    }
  }
  .sub-sections {
    margin-left: 0px;
  }
  .section-items {
    margin-left: 0px;
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
