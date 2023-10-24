<template>
  <section
    class="advanced-search"
    :style="'min-height: ' + minHeight"
  >
    <div class="field">
      <WeprodeInput
        ref="queryInput"
        v-model="searchQuery"
        :maxlength="200"
        :placeholder="$t('queryPlaceholder')"
        @keyup.enter.stop="runSearch"
      />
      <WeprodeErrorMessage :error-message="$t(errorMessage)" />
    </div>

    <WeprodeDropdown
      v-model="selectedRole"
      class="field"
      :list="roleList"
      :sort="false"
      display-field="label"
    />

    <WeprodeDropdown
      v-model="selectedSchool"
      class="field"
      :list="schoolList"
      :sort="false"
      display-field="schoolName"
    />

    <WeprodeButton
      :label="$t('search')"
      @click="runSearch"
    />
  </section>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'

import { getAllSchools } from '@/api/organization.service'
import { getRoleList } from '@/api/role.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'

export default {
  name: 'ContactAdvancedSearch',
  components: { WeprodeButton, WeprodeDropdown, WeprodeErrorMessage, WeprodeInput },
  props: {
    minHeight: {
      type: String,
      default: undefined
    }
  },
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
    this.$store.dispatch('contact/resetUserList')
    this.$store.dispatch('contact/setActiveTab', 'advancedSearch')
    getRoleList().then((data) => {
      if (data.success) {
        this.selectedRole = this.emptyRole
        this.roleList = [this.emptyRole, ...WeprodeUtils.sortArrayWithString(data.roles, false, 'label')]
      }
    })
    getAllSchools().then((data) => {
      if (data.success) {
        this.selectedSchool = this.emptySchool
        this.schoolList = [this.emptySchool, ...WeprodeUtils.sortArrayWithString(data.schools, false, 'schoolName')]
      }
    })
  },
  methods: {
    runSearch () {
      if (this.selectedRole.roleId === 0 && this.selectedSchool.schoolId === 0 && this.searchQuery.length < 2) {
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
