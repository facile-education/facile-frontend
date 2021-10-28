<template>
  <div>
    <!-- Current folder name input -->

    <!-- Item list -->
    <div
      v-if="itemList.length > 0"
      class="items-list"
    >
      <ProgressionItem
        v-for="item in itemList"
        :key="item.itemId"
        :item="item"
        class="item"
      >
        <h4>
          {{ item.name }}
        </h4>
      </ProgressionItem>
    </div>

    <!-- Empty section -->
    <div
      v-else-if="currentFolder"
      class="empty-section"
    >
      <div
        class="spans"
      >
        <span>{{ $t('emptySection') }}</span>
        <span
          class="blue"
          @click.stop="toggleCreateMenu"
        >{{ $t('insertNewContent') }}</span>
      </div>
    </div>

    <!-- Empty progression -->
    <div
      v-else
      class="empty-progression"
    >
      <div
        class="spans"
      >
        <span
          class="blue"
          @click.stop="toggleCreateMenu"
        >{{ $t('addFirstContent') }}</span>
        <div
          class="tips"
        >
          <span
            class="tip-label"
          >{{ $t('tip-label') }}
          </span>
          <span>{{ $t('tip') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressionItem from '@/components/Progression/Edit/ProgressionItem'

export default {
  name: 'ProgressionEditMode',
  components: { ProgressionItem },
  data () {
    return {
      updatedFolderName: '',
      displayFolderName: true
    }
  },
  computed: {
    itemList () {
      if (this.$store.state.progression.currentItem !== undefined) {
        // 1 item is selected -> display it
        return [this.$store.state.progression.currentItem]
      } else if (this.currentFolder !== undefined) {
        // 1 section or sub-section is selected -> display recursively all its items
        const items = []
        if (this.currentFolder.items !== undefined && this.currentFolder.items.length > 0) {
          Array.prototype.push.apply(items, this.currentFolder.items)
        }
        if (this.currentFolder.subSections !== undefined && this.currentFolder.subSections.length > 0) {
          for (let subIdx = 0; subIdx < this.currentFolder.subSections.length; subIdx++) {
            const subSection = this.currentFolder.subSections[subIdx]
            if (subSection.items !== undefined && subSection.items.length > 0) {
              Array.prototype.push.apply(items, subSection.items)
            }
          }
        }
        return items
      } else {
        return []
      }
    },
    currentFolder () {
      return this.$store.state.progression.currentFolder
    }
  },
  methods: {
    toggleCreateMenu () {
      this.$store.dispatch('progression/setCreateMenuDisplayed', !this.$store.state.progression.isCreateMenuDisplayed)
    }
  }
}
</script>

<style lang="scss" scoped>

.items-list {
  width: 100%;

  .item {
    width: 100%;
  }
}

.empty-section, .empty-progression {
  height: 400px;
  border: 1px solid #D4D4D4;
  border-radius: 6px;
  background-color: #FFFFFF;
  margin-top: 5px;
  display: flex;

  .spans {
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: auto;

    .tips {
      display: flex;
    }

    .blue {
      color: blue;
      text-decoration: underline;

      &:hover {
        cursor: pointer;
      }
    }

    .tip-label {
      font-weight: bold;
      margin-right: 5px;
    }

    span {
      text-align: center;
      margin: auto;
    }
  }
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
  "delete": "Supprimer cette section",
  "emptySection": "Cette section est vide",
  "insertNewContent": "Ajouter le premier contenu de votre section",
  "addFirstContent": "Ajouter le premier contenu de votre progression!",
  "tip-label": "Astuces : ",
  "tip": "vous pouvez ajouter des sections et des sous-sections pour organiser votre progression."
}
</i18n>
