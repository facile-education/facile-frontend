<template>
  <div>
    <div
      class="sub-section-header"
      :class="{'extended': isExtended}"
      @mouseover="isHoverTitle = true"
      @mouseleave="isHoverTitle = false"
      @click="toggleExtension"
    >
      <h3 class="sub-section-title">
        {{ subsection.name }}
      </h3>
      <div
        class="arrow"
        :title="isExtended ? $t('extend') : $t('collapse')"
      >
        <img
          src="@assets/arrow-right.svg"
          :class="{'extended': isExtended}"
          :alt="isExtended ? $t('extend') : $t('collapse')"
        >
      </div>
      <div
        v-if="isHoverTitle"
        class="edit"
        @click.stop="redirectSubSection"
      >
        <img
          src="@assets/edit.svg"
          :alt="$t('edit')"
          :title="$t('edit')"
        >
      </div>
    </div>
    <div
      v-if="isExtended"
      class="items"
    >
      <ProgressionItem
        v-for="item in subsection.items"
        :key="item.itemId"
        :item="item"
        class="item"
      >
        <h4>
          {{ item.name }}
        </h4>
      </ProgressionItem>
    </div>
  </div>
</template>

<script>
import ProgressionItem from '@components/Progression/Edit/ProgressionItem'
import { nextTick } from 'vue'

export default {
  name: 'ProgressionSubsectionItem',
  components: { ProgressionItem },
  props: {
    subsection: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isHoverTitle: false,
      isExtended: false
    }
  },
  methods: {
    redirectSubSection () {
      this.$store.dispatch('progression/setCurrentFolder', this.subsection)
    },
    toggleExtension () {
      this.isExtended = !this.isExtended

      if (this.isExtended) {
        this.$store.dispatch('progression/getFolderContent', this.subsection.folderId)
        nextTick(() => {
          this.$el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.sub-section-header {
  display: flex;
  align-items: center;
  cursor: pointer;

  .sub-section-title {
    color: black;
  }

  .arrow {
    margin-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      height: 15px;
      width: 8px;
      transition: all .3s ease;
    }

    .extended {
      transform: rotate(90deg);
    }
  }

  .edit {
    margin-left: auto;
    margin-right: 10px;

    img {
      height: 20px;
    }
  }

  &.extended {
    margin-bottom: 10px;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>

<i18n locale="fr">
{
  "edit": "Éditer",
  "extend": "Déplier",
  "collapse": "Replier"
}
</i18n>
