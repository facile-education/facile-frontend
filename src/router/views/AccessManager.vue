<template>
  <!--  TODO : check isSchoolAdmin role-->
  <Layout
    :is-allowed="$store.state.user.isSchoolAdmin"
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />

    <SchoolSelector />

    <AccessCreateButton
      class="create-button"
      @createCategory="isCreateCategoryInputDisplayed=true"
      @createAccess="isSaveAccessModalDisplayed=true"
    />

    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="categoryList.length === 0 && !isCreateCategoryInputDisplayed"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />

    <AccessCategoryList
      v-else
      :category-list="categoryList"
    />

    <AccessCategoryInput
      v-if="isCreateCategoryInputDisplayed"
      @submitName="createCategory"
      @close="isCreateCategoryInputDisplayed = false"
    />

    <AccessFooter
      class="footer"
      @reset="reset"
      @submit="submit"
    />
  </Layout>

  <teleport
    v-if="isSaveAccessModalDisplayed"
    to="body"
  >
    <SaveAccessModal
      :category-list="categoryList"
      @createAccess="createAccess"
      @close="isSaveAccessModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'
import AccessCategoryList from '@components/Accesses/AccessManager/AccessCategoryList.vue'
import { defineAsyncComponent } from 'vue'
import AccessCreateButton from '@components/Accesses/AccessManager/AccessCreateButton.vue'
import AccessCategoryInput from '@components/Accesses/AccessManager/AccessCategoryInput.vue'
import SchoolSelector from '@components/Accesses/AccessManager/SchoolSelector.vue'
import AccessFooter from '@components/Accesses/AccessManager/AccessFooter.vue'
import { saveSchoolAccesses } from '@/api/access.service'
const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessManager',
  components: {
    AccessFooter,
    SchoolSelector,
    AccessCategoryInput,
    AccessCreateButton,
    SaveAccessModal,
    AccessCategoryList,
    Layout
  },
  data () {
    return {
      isSaveAccessModalDisplayed: false,
      isCreateCategoryInputDisplayed: false
    }
  },
  computed: {
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
    }
  },
  methods: {
    createCategory (name) {
      this.isCreateCategoryInputDisplayed = false
      if (name.length > 0) {
        const newCategoryList = [...this.categoryList]
        newCategoryList.push({
          categoryName: name,
          schoolId: this.selectedSchool,
          position: this.categoryList.length,
          accessList: []
        })
        this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
      }
    },
    createAccess (access) {
      // Deep copy categoryList
      const newCategoryList = JSON.parse(JSON.stringify(this.categoryList))
      // Add the new access in place
      const categoryIndex = newCategoryList.map(category => category.categoryId).indexOf(access.categoryId)
      if (categoryIndex !== -1) {
        const category = newCategoryList[categoryIndex]
        category.accessList.push(access)
        // Set the new categoryList
        this.$store.dispatch('accessManager/setCategoryList', newCategoryList)
      } else {
        console.error("Can't find categoryId " + access.categoryId + ' in ', this.categoryList())
      }
    },
    reset () {
      this.$store.dispatch('accessManager/setCategoryList', this.initialCategoryList)
    },
    submit () {
      saveSchoolAccesses(this.selectedSchool.schoolId, this.categoryList).then((data) => {
        if (data.success) {
          this.$store.dispatch('accessManager/getSchoolAccesses') // Reload changes to assure to have the backend-data
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          console.error('Error')
        }
      })
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

.create-button {
  margin-bottom: 15px;
}

.footer {
  margin-top: 15px;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun accès",
  "serviceTitle": "Gestion des accès"
}
</i18n>
