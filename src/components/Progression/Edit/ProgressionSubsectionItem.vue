<template>
  <div>
    <div
      class="sub-section-header"
      :class="{'extended': isExtended}"
    >
      <PentilaInput
        ref="folderName"
        v-model="subSectionNameInputText"
        :maxlength="75"
        class="sub-section-title"
        @blur="saveNewFolderName"
        @keyup.enter="pressEnter"
      />
      <div
        class="arrow"
        :title="isExtended ? $t('extend') : $t('collapse')"
        @click="toggleExtension"
      >
        <img
          src="@assets/arrow-right.svg"
          :class="{'extended': isExtended}"
          :alt="isExtended ? $t('extend') : $t('collapse')"
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
      isExtended: false,
      subSectionNameInputText: ''
    }
  },
  created () {
    this.subSectionNameInputText = this.subsection.name
  },
  methods: {
    pressEnter () {
      this.$refs.folderName.$el.blur()
    },
    toggleExtension () {
      this.isExtended = !this.isExtended

      if (this.isExtended) {
        this.$store.dispatch('progression/getFolderContent', this.subsection.folderId)
        nextTick(() => {
          this.$el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        })
      }
    },
    saveNewFolderName () {
      if (this.subSectionNameInputText === '') {
        this.subSectionNameInputText = this.currentFolderName // Reset name to old one
      } else {
        if (this.subSectionNameInputText !== this.subsection.name) {
          // TODO: handle WS error to 'unUpdate' folderNameInputText
          const folderCopy = { ...this.subsection }
          folderCopy.name = this.subSectionNameInputText
          this.$store.dispatch('progression/updateFolder', folderCopy)
        }
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
    margin-right: 15px;
    padding-left: 10px;
    /* TODO adapt width (or input size property) with text size */
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    font-size: 1.125rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 19px;
    background: none;

    &:focus {
      background-color: #F5F5F5;
    }
    &:not(:hover) {
      border: none;
      margin-bottom: 1px;
    }
  }

  .arrow {
    width: 235px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      height: 24px;
      width: 13px;
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
    //text-decoration: underline;
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
