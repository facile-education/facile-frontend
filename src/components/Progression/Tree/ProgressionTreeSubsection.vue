<template>
  <div
    class="tree-subsection"
  >
    <div
      class="subsection-header"
      :class="{'selected': isSelected }"
    >
      <div
        class="subsection-name"
        @click="selectSubsection"
      >
        <!-- Subsection name -->
        <span>
          {{ subSection.name }}
        </span>

        <!-- Number of items -->
        <span
          v-if="!isExpanded"
        >
          ({{ nbItems }})
        </span>
      </div>

      <!-- Right arrow icon -->
      <img
        v-if="!isExpanded"
        class="arrow"
        src="@assets/arrow-right.svg"
        :alt="$t('expand')"
        :title="$t('expand')"
        @click="expand()"
      >
      <!-- Down arrow icon -->
      <img
        v-if="isExpanded"
        class="arrow"
        src="@assets/arrow-down.svg"
        :alt="$t('collapse')"
        :title="$t('collapse')"
        @click="collapse()"
      >
    </div>

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
    },
    nbItems () {
      if (this.subSection.items === undefined) {
        return 0
      }
      return this.subSection.items.length
    },
    isSelected () {
      // Sub-section is selected when itself is selected or its parent section
      return this.$store.state.progression.currentFolder !== undefined && (this.$store.state.progression.currentFolder.folderId === this.subSection.folderId || this.$store.state.progression.currentFolder.folderId === this.subSection.parentId)
    }
  },
  created () {
    this.isExpanded = false
  },
  methods: {
    expand () {
      this.isExpanded = true
    },
    collapse () {
      this.isExpanded = false
    },
    selectSubsection () {
      this.$store.dispatch('progression/setCurrentFolder', this.subSection)
      this.expand()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-subsection {
  .subsection-header {
    display: flex;
    justify-content: space-between;
    .subsection-name {
      margin-left: 5px;
      height: 25px;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 16px;
      span {
        vertical-align: sub;
      }
    }
    &:hover {
      background-color: #EFF3FB;
    }
    &.selected {
      color: #306CD3;
    }
    .arrow {
      margin-right: 10px;
    }
  }
  .tree-items {
    margin-left: 10px;
  }
}
</style>

<i18n locale="fr">
{
  "expand": "Déplier",
  "collapse": "Replier"
}
</i18n>
