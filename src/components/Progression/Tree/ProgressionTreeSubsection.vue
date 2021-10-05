<template>
  <div
    class="tree-subsection"
  >
    <div
      class="subsection-header"
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
      return this.subSection.items.length
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
  margin-left: 10px;
  margin-right: 50px;
  .subsection-header {
    display: flex;
    justify-content: space-between;
    .subsection-name {
      color: #306CD3;
      font-family: Roboto;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 16px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "expand": "Déplier",
  "collapse": "Replier"
}
</i18n>
