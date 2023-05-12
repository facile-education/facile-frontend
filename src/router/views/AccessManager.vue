<template>
  <!--  TODO : check isSchoolAdmin role-->
  <Layout
    :is-allowed="$store.state.user.isSchoolAdmin"
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />

    <SchoolSelector @setSchool="setSchool" />

    <AccessCreateButton
      :can-create-access="categoryList.length > 0"
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
import { getSchoolAccesses } from '@/api/access.service'
import AccessCategoryList from '@components/Accesses/AccessManager/AccessCategoryList.vue'
import { defineAsyncComponent } from 'vue'
import AccessCreateButton from '@components/Accesses/AccessManager/AccessCreateButton.vue'
import AccessCategoryInput from '@components/Accesses/AccessManager/AccessCategoryInput.vue'
import SchoolSelector from '@components/Accesses/AccessManager/SchoolSelector.vue'
const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessManager',
  components: {
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
      isCreateCategoryInputDisplayed: false,
      isLoading: false,
      error: false,
      selectedSchool: undefined,
      initialCategoryList: [],
      categoryList: []
    }
  },
  methods: {
    setSchool (school) {
      this.selectedSchool = school
      this.getSchoolAccesses()
    },
    getSchoolAccesses () {
      this.isLoading = true
      getSchoolAccesses(this.selectedSchool.schoolId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.initialCategoryList = data.accesses
          this.categoryList = data.accesses
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    createCategory (name) {
      this.isCreateCategoryInputDisplayed = false
      if (name.length > 0) {
        this.categoryList.push({
          categoryName: name,
          schoolId: this.selectedSchool,
          position: this.categoryList.length,
          accessList: []
        })
      }
    },
    createAccess () {
      console.log('TODO')
    },
    updateAccess () {
      console.log('TODO')
    }
  }
}
</script>

<style lang="scss" scoped>

.school-selection {
  display: flex;
  justify-content: flex-end;
}

</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun accès",
  "serviceTitle": "Gestion des accès",
  "rolePlaceholder": "Choisir un profil",
  "new": "Nouveau",
  "seeAs": "Voir en tant que"
}
</i18n>
