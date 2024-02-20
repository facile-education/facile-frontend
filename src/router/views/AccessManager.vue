<template>
  <h1 :aria-label="$t('AccessManager.serviceTitle')" />

  <div v-if="roleList && roleList.length > 0">
    <SchoolSelector class="school-selector" />

    <div class="first-line">
      <AccessCreateButton
        @create-category="isCreateCategoryInputDisplayed=true"
        @create-access="isSaveAccessModalDisplayed=true"
      />

      <SeeAccessesAs />
    </div>

    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'AccessManager.errorPlaceholder'"
      class="placeholder"
    />
    <CategoriesPlaceholder
      v-else-if="categoryList && categoryList.length === 0 && !isCreateCategoryInputDisplayed"
      @create-category="isCreateCategoryInputDisplayed=true"
    />

    <AccessCategoryList
      v-else-if="categoryList"
      :category-list="sortedCategoryList"
    />

    <AccessCategoryInput
      v-if="isCreateCategoryInputDisplayed"
      class="category-input"
      data-test="category-input"
      @submit-name="createCategory"
      @close="isCreateCategoryInputDisplayed = false"
    />
  </div>
  <div
    v-else-if="roleList && roleList.length === 0"
    v-t="'AccessManager.noRolePlaceholder'"
    class="placeholder"
  />

  <teleport
    v-if="isSaveAccessModalDisplayed"
    to="body"
  >
    <SaveAccessModal
      @close="isSaveAccessModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import AccessCategoryInput from '@components/Accesses/AccessManager/AccessCategoryInput.vue'
import AccessCategoryList from '@components/Accesses/AccessManager/AccessCategoryList.vue'
import AccessCreateButton from '@components/Accesses/AccessManager/AccessCreateButton.vue'
import CategoriesPlaceholder from '@components/Accesses/AccessManager/CategoriesPlaceholder.vue'
import SchoolSelector from '@components/Accesses/AccessManager/SchoolSelector.vue'
import SeeAccessesAs from '@components/Accesses/AccessManager/SeeAccessesAs.vue'
import { sortAccesses } from '@utils/accessUtils'
import { defineAsyncComponent } from 'vue'

import { saveSchoolCategory } from '@/api/access.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessManager',
  components: {
    SeeAccessesAs,
    CategoriesPlaceholder,
    SchoolSelector,
    AccessCategoryInput,
    AccessCreateButton,
    SaveAccessModal,
    AccessCategoryList,
    WeprodeSpinner
  },
  data () {
    return {
      isSaveAccessModalDisplayed: false,
      isCreateCategoryInputDisplayed: false
    }
  },
  computed: {
    roleList () {
      return this.$store.state.accessManager.roleList
    },
    selectedSchool () {
      return this.$store.state.accessManager.selectedSchool
    },
    isLoading () {
      return this.$store.state.accessManager.isLoading
    },
    error () {
      return this.$store.state.accessManager.error
    },
    initialCategoryList () {
      return this.$store.state.accessManager.initialCategoryList
    },
    categoryList () {
      return this.$store.state.accessManager.categoryList
    },
    sortedCategoryList () {
      return sortAccesses(this.categoryList)
    }
  },
  created () {
    if (!this.roleList) {
      this.$store.dispatch('accessManager/getRoleList')
    }
  },
  methods: {
    createCategory (name) {
      this.isCreateCategoryInputDisplayed = false
      if (name.length > 0) {
        const category = { categoryName: name, position: this.categoryList.length }
        saveSchoolCategory(this.selectedSchool.schoolId, category).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('AccessManager.saveSuccess'), type: 'success' })
            this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    reset () {
      this.$store.dispatch('accessManager/setCategoryList', this.initialCategoryList)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  text-align: center;
  border: 1px solid $color-border;
  border-radius: 6px;
}

.school-selector {
  margin-bottom: 15px;
}

.first-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.category-input {
  margin-top: 15px
}

.footer {
  margin-top: 15px;
}
</style>
