<template>
  <section class="advanced-search">
    <div class="field">
      <PentilaInput
        ref="queryInput"
        v-model="searchQuery"
        :maxlength="200"
        :placeholder="$t('queryPlaceholder')"
        @keyup.enter.stop="runSearch"
      />
      <PentilaErrorMessage :error-message="$t(errorMessage)" />
    </div>

    <PentilaDropdown
      v-model="selectedRole"
      class="field"
      :list="roleList"
      display-field="label"
    />

    <PentilaDropdown
      v-model="selectedSchool"
      class="field"
      :list="schoolList"
      display-field="schoolName"
    />

    <PentilaButton
      :label="$t('search')"
      @click="runSearch"
    />
  </section>
</template>

<script>
import { getLocalUserRoleList } from '@/api/role.service'
import PentilaUtils from 'pentila-utils'
import { getAllSchools } from '@/api/organization.service'

export default {
  name: 'ContactAdvancedSearch',
  data () {
    return {
      searchQuery: '',
      errorMessage: '',
      roleList: [],
      selectedRole: undefined,
      emptyRole: { label: this.$t('rolesPlaceHolder'), roleId: 0 },
      schoolList: [],
      selectedSchool: undefined,
      emptySchool: { schoolName: this.$t('schoolsPlaceHolder'), schoolId: 0 }
    }
  },
  mounted () {
    const input = this.$refs.queryInput
    input.focus()
    input.select()
  },
  created () {
    getLocalUserRoleList().then((data) => {
      if (data.success) {
        this.selectedRole = this.emptyRole
        this.roleList = [this.emptyRole, ...PentilaUtils.Array.sortWithString(data.roles, false, 'label')]
      }
    })
    getAllSchools().then((data) => {
      if (data.success) {
        this.selectedSchool = this.emptySchool
        this.schoolList = [this.emptySchool, ...PentilaUtils.Array.sortWithString(data.schools, false, 'schoolName')]
      }
    })
  },
  methods: {
    runSearch () {
      if (this.selectedRole.roleId === 0 && this.selectedSchool.schoolId === 0 && this.searchQuery.length <= 2) {
        this.errorMessage = 'emptyRequest'
      } else {
        this.errorMessage = ''
        this.$store.dispatch('contact/getUsersFromSearch', { query: this.searchQuery, roleId: this.selectedRole.roleId, schoolId: this.selectedSchool.schoolId })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.advanced-search {
  margin-top: 5px;
  min-height: 20vh;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.field {
  margin-bottom: 20px;
}
</style>

<i18n locale="fr">
{
  "queryPlaceholder": "Nom/prénom",
  "emptyRequest": "Veuillez renseigner au moins 2 caractères pour la recherche ou séléctionnez un élément dans une des liste déroulantes",
  "rolesPlaceHolder": "Tous les profils",
  "schoolsPlaceHolder": "Tous les établissements",
  "search": "Rechercher"
}
</i18n>
