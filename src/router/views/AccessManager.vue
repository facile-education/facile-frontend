<template>
  <!--  TODO : check isSchoolAdmin role-->
  <Layout
    :is-allowed="$store.state.user.isSchoolAdmin"
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />
    <div
      v-if="schoolList && schoolList.length > 1"
      class="school-selection"
    >
      <PentilaDropdown
        v-model="selectedSchool"
        :list="schoolList"
        display-field="schoolName"
        @update:modelValue="getSchoolAccesses"
      />
    </div>
    <div class="first-line">
      <PentilaButton
        class="create-button"
        data-test="createMessageButton"
        @click="clickNew"
      >
        <NeroIcon
          name="fa-plus"
        />
        <span v-t="'new'" />
      </PentilaButton>

      <div class="see-preview">
        <span v-t="('seeAs')" />
        <PentilaDropdown
          v-model="selectedRole"
          :list="roleList"
          display-field="displayText"
          :sort="false"
          @update:modelValue="seePreview"
        />
      </div>
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
    <div
      v-else-if="categoryList.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />

    <AccessCategoryList
      v-else
      :category-list="categoryList"
    />
  </Layout>

  <teleport
    v-if="isSaveAccessModalDisplayed"
    to="body"
  >
    <SaveAccessModal
      :category-list="categoryList"
      @createAccess="createAccess"
      @updateAccess="updateAccess"
      @close="isSaveAccessModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout'
import NeroIcon from '@components/Nero/NeroIcon.vue'
import { getUserSchoolList } from '@/api/mediacenter.service'
import { getSchoolAccesses } from '@/api/access.service'
import { getBroadcastRoleList } from '@/api/role.service'
import AccessCategoryList from '@components/Accesses/AccessManager/AccessCategoryList.vue'
import { defineAsyncComponent } from 'vue'
const SaveAccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessManager/SaveAccessModal.vue'))

export default {
  name: 'AccessManager',
  components: {
    SaveAccessModal,
    AccessCategoryList,
    NeroIcon,
    Layout
  },
  data () {
    return {
      isLoading: false,
      error: false,
      isSaveAccessModalDisplayed: false,
      selectedSchool: undefined,
      // schoolList: [],
      selectedRole: undefined,
      roleList: [],
      categoryList: []
    }
  },
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
    }
  },
  created () {
    // this.getSchoolList()
    this.getRoleList()
  },
  methods: {
    getSchoolList () {
      getUserSchoolList().then((data) => {
        if (data.success) {
          this.schoolList = data.schools
          this.selectedSchool = data.schools[0]
        }
      })
    },
    getRoleList () {
      getBroadcastRoleList().then((data) => {
        if (data.success) {
          this.roleList = data.roles
          this.roleList.unshift({ id: -1, displayText: this.$t('rolePlaceholder') })
          this.selectedRole = this.roleList[0]
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    getSchoolAccesses () {
      this.isLoading = true
      getSchoolAccesses(this.selectedSchool.schoolId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
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
    createAccess () {
      console.log('TODO')
    },
    updateAccess () {
      console.log('TODO')
    },
    clickNew () {
      console.log('TODO')
    },
    seePreview () {
      console.log('TODO')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.school-selection {
  display: flex;
  justify-content: flex-end;
}

.first-line {
  display: flex;
  justify-content: space-between;
}

.create-button {
  @extend %create-button;
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
