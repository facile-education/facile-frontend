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

      <WeprodeButton
        class="delete-button"
        data-test="deleteCategory"
        cls="cancel"
        :title="$t('Accesses.AccessCategoryItem.delete')"
        :aria-label="$t('Accesses.AccessCategoryItem.delete')"
        @click="confirmDeleteCategory"
      >
        <CustomIcon
          icon-name="icon-trash"
        />
        <span v-t="'Accesses.AccessCategoryItem.delete'" />
      </WeprodeButton>
    </div>

    <AccessesPlaceholder
      v-if="category.accessList.length === 0"
      :parent-category="category"
    />

    <ul v-else>
      <li
        v-for="access in sortedAccesses"
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import _ from 'lodash'

import { removeSchoolCategory, saveSchoolCategory } from '@/api/access.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'AccessCategoryItem',
  components: { CustomIcon, AccessesPlaceholder, AccessCategoryInput, AccessItem, WeprodeButton },
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
    },
    sortedAccesses () {
      return _.orderBy(this.category.accessList, 'position', 'asc')
    }
  },
  methods: {
    confirmDeleteCategory () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Accesses.AccessCategoryItem.deleteCategoryWarning', { categoryName: this.category.categoryName }),
        lastAction: { fct: this.deleteCategory }
      })
    },
    updateName (name) {
      this.isNameModification = false

      if (name.length > 0) {
        saveSchoolCategory(this.selectedSchool.schoolId, { ...this.category, categoryName: name }).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Accesses.AccessCategoryItem.saveSuccess'), type: 'success' })
            this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to ensure to have the backend-data
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    deleteCategory () {
      removeSchoolCategory(this.selectedSchool.schoolId, this.category.categoryId).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Accesses.AccessCategoryItem.deleteSuccess'), type: 'success' })
          this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to ensure to have the backend-data
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

.button.delete-button {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 12px;
  }

  .icon-trash {
    font-size: 18px;
  }
}
</style>
