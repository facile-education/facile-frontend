<template>
  <div class="category">
    <div
      class="category-item"
    >
      <h2
        v-if="!isNameModification"
        class="title"
        tabindex="0"
        @click="isNameModification = true"
        @keyup.enter="isNameModification = true"
      >
        {{ category.categoryName }}
      </h2>

      <AccessCategoryInput
        v-else
        class="title"
        :initial-name="category.categoryName"
        @submit-name="updateName"
        @close="isNameModification = false"
      />

      <PentilaButton
        class="delete-button"
        cls="cancel"
        @click="confirmDeleteCategory"
      >
        <img
          class="trash-icon"
          src="@/assets/icons/trash.svg"
          :alt="$t('delete')"
          :title="$t('delete')"
        >
        <span v-t="'delete'" />
      </PentilaButton>
    </div>

    <AccessesPlaceholder
      v-if="category.accessList.length === 0"
      :parent-category="category"
    />

    <ul v-else>
      <li
        v-for="access in category.accessList"
        :key="access.title"
      >
        <AccessItem
          :access="access"
          :parent-category="category"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import AccessCategoryInput from '@components/Accesses/AccessManager/AccessCategoryInput.vue'
import AccessesPlaceholder from '@components/Accesses/AccessManager/AccessesPlaceholder.vue'
import AccessItem from '@components/Accesses/AccessManager/AccessItem.vue'

import { removeSchoolCategory, saveSchoolCategory } from '@/api/access.service'

export default {
  name: 'AccessCategoryItem',
  components: { AccessesPlaceholder, AccessCategoryInput, AccessItem },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isNameModification: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    selectedSchool () {
      return this.$store.state.accessManager.selectedSchool
    }
  },
  methods: {
    confirmDeleteCategory () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('deleteCategoryWarning', { categoryName: this.category.categoryName }),
        lastAction: { fct: this.deleteCategory }
      })
    },
    updateName (name) {
      this.isNameModification = false

      if (name.length > 0) {
        saveSchoolCategory(this.selectedSchool.schoolId, { ...this.category, categoryName: name }).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('saveSuccess'), type: 'success' })
            this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    deleteCategory () {
      removeSchoolCategory(this.selectedSchool.schoolId, this.category.categoryId).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('saveSuccess'), type: 'success' })
          this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h2 {
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0 0 1px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: text;
  border: none;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid black;
  }
}

ul {
  margin: 0 0 0 30px;
  padding: 0;
  list-style-type: none;

  li {
    margin-top: 10px;
  }
}

.category-item {
  height: 50px;
  display: flex;
}

.title {
  flex: 1;
  font-size: 1.5rem;
  font-weight: 500;
  padding-left: 0;
}

.delete-button {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 12px;
  }

  .trash-icon {
    width: 20px;
    height: 20px;
  }
}
</style>

<i18n locale="fr">
{
  "delete": "Supprimer cette catégorie",
  "deleteCategoryWarning": "Souhaitez-vous supprimer la catégorie {categoryName} et ses accès?",
  "saveSuccess": "Catégorie mise à jour avec succès"
}
</i18n>
