<template>
  <div
    class="tree-subsection"
  >
    <div
      class="subsection-header"
      :class="{'selected': isSelected }"
      @click="selectSubsection"
    >
      <div
        class="subsection-name"
        :title="subSection.name"
      >
        <!-- Subsection name -->
        <span>
          {{ subSection.name }}
        </span>
      </div>

      <!-- Number of items -->
      <span
        v-if="!isExpanded"
        class="item-number"
      >
        ({{ nbItems }})
      </span>

      <!-- Right arrow icon -->
      <div class="arrow">
        <img
          src="@assets/arrow-right.svg"
          :class="{'expended': isExpanded}"
          :alt="$t('expand')"
          :title="$t('expand')"
        >
        <!--        &lt;!&ndash; Down arrow icon &ndash;&gt;-->
        <!--        <img-->
        <!--          v-if="isExpanded"-->
        <!--          src="@assets/arrow-down.svg"-->
        <!--          :alt="$t('collapse')"-->
        <!--          :title="$t('collapse')"-->
        <!--        >-->
      </div>
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
    selectSubsection () {
      this.$store.dispatch('progression/setCurrentFolder', this.subSection)
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style lang="scss" scoped>

.tree-subsection {

  .subsection-header {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;

    .subsection-name {
      color: black;
      flex: 1;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 25px;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 16px;
      display: flex;
      align-items: center;

      span {
        width: 100%;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .item-number {
      font-size: 0.75rem;
      margin-right: 5px;
      margin-left: 5px;
    }

    .arrow {
      width: 11px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        transition: all .3s ease;
      }

      .expended {
        transform: rotate(90deg);
      }
    }

    &:hover {
      background-color: #EFF3FB;
    }

    &.selected {
      .subsection-name, .item-number{
        color: #306CD3;
      }
    }
  }

  .tree-items {
    margin-left: 13px;
  }
}
</style>

<i18n locale="fr">
{
  "expand": "Déplier",
  "collapse": "Replier"
}
</i18n>
