<template>
  <Layout
    :is-allowed="$store.state.user.isAdministrator || $store.state.user.isLocalAdmin || $store.state.user.isENTAdmin || $store.state.user.isDirectionMember"
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />

    <div v-if="roleList.length > 0">
      <SchoolSelector class="school-selector" />

      <div class="first-line">
        <AccessCreateButton
          @createCategory="isCreateCategoryInputDisplayed=true"
          @createAccess="isSaveAccessModalDisplayed=true"
        />

        <SeeAccessesAs />
      </div>

      <PentilaSpinner
        v-if="isLoading"
        style="z-index: 1"
      />
      <div
        v-if="error === true"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />
      <CategoriesPlaceholder
        v-else-if="categoryList.length === 0 && !isCreateCategoryInputDisplayed"
        @createCategory="isCreateCategoryInputDisplayed=true"
      />

      <AccessCategoryList
        v-else
        :category-list="sortedCategoryList"
      />

      <AccessCategoryInput
        v-if="isCreateCategoryInputDisplayed"
        class="category-input"
        @submitName="createCategory"
        @close="isCreateCategoryInputDisplayed = false"
      />

      <AccessFooter
        class="footer"
        @reset="reset"
        @submit="submit"
      />
    </div>
    <div
      v-else
      v-t="'noRolePlaceholder'"
      class="placeholder"
    />
  </Layout>

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
import Layout from '@/router/layouts/BannerLayout'
import AccessCategoryList from '@components/Accesses/AccessManager/AccessCategoryList.vue'
import { defineAsyncComponent } from 'vue'
import AccessCreateButton from '@components/Accesses/AccessManager/AccessCreateButton.vue'
import AccessCategoryInput from '@components/Accesses/AccessManager/AccessCategoryInput.vue'
import SchoolSelector from '@components/Accesses/AccessManager/SchoolSelector.vue'
import AccessFooter from '@components/Accesses/AccessManager/AccessFooter.vue'
import { saveSchoolAccesses } from '@/api/access.service'
import { sortAccesses } from '@utils/accessUtils'
import CategoriesPlaceholder from '@components/Accesses/AccessManager/CategoriesPlaceholder.vue'
import SeeAccessesAs from '@components/Accesses/AccessManager/SeeAccessesAs.vue'
const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessManager',
  components: {
    SeeAccessesAs,
    CategoriesPlaceholder,
    AccessFooter,
    SchoolSelector,
    AccessCategoryInput,
    AccessCreateButton,
    SaveAccessModal,
    AccessCategoryList,
    Layout
  },
  beforeRouteLeave (to, from, next) {
    if (this.haveChanges) {
      const answer = window.confirm(this.$t('confirmExitMessage'))
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
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
    },
    haveChanges () {
      return this.$store.getters['accessManager/haveChanges']
    }
  },
  created () {
    if (this.roleList.length === 0) {
      this.$store.dispatch('accessManager/getRoleList')
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.confirmExit)
  },
  beforeUnmount () {
    window.removeEventListener('beforeunload', this.confirmExit)
  },
  methods: {
    confirmExit (event) {
      if (this.haveChanges) {
        const confirmationMessage = this.$t('confirmExitMessage')
        // For old versions of Chrome and Firefox
        event.returnValue = confirmationMessage
        // The return value is used by most of modern browsers
        return confirmationMessage
      }
    },
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
    reset () {
      this.$store.dispatch('accessManager/setCategoryList', this.initialCategoryList)
    },
    submit () {
      saveSchoolAccesses(this.selectedSchool.schoolId, this.categoryList).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('saveSuccess'), type: 'success' })
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

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "serviceTitle": "Gestion des accès",
  "saveSuccess": "Accès mis à jour avec succès!",
  "noRolePlaceholder": "Erreur lors de la récupération des roles, veuillez contacter le service technique",
  "confirmExitMessage": "Êtes-vous sûr de vouloir quitter cette page ? Les modifications non sauvegardées seront perdues."
}
</i18n>
