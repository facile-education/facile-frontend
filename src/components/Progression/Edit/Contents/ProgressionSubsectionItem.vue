<template>
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
        src="@assets/arrow-down.svg"
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
</template>

<script>
import ProgressionItem from '@/components/Progression/Edit/ProgressionItem'

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
      if (!this.isExtended) { // TODO maybe call backend only if the content has not already loaded before
        this.$store.dispatch('progression/getFolderContent', this.subsection.folderId)
      }

      this.isExtended = !this.isExtended
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
      height: 8px;
      width: 15px;
      transition: all .3s ease;
    }

    .extended {
      transform: rotate(180deg);
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
