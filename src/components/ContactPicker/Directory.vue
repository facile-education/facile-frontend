<template>
  <div class="directory-panel">
    <PentilaInput
      ref="queryInput"
      v-model="searchQuery"
      class="query"
      :maxlength="200"
      :placeholder="$t('queryPlaceholder')"
      @keyup.enter.stop="runSearch"
    />

    <!-- Role -->
    <div
      v-if="(roleList)"
      class="role"
    >
      <p v-t="'role'" />
      <PentilaDropdown
        v-model="selectedRole"
        :list="roleList"
        display-field="label"
      />
    </div>

    <!-- School -->
    <div class="school">
      <p v-t="'school'" />
      <PentilaDropdown
        v-if="schoolList"
        v-model="selectedSchool"
        :list="schoolList"
        display-field="schoolName"
      />
    </div>
    <PentilaButton
      :label="$t('search')"
      class="button"
      @click="runSearch"
    />
  </div>
</template>

<script>

import { getLocalUserRoleList } from '@/api/role.service'
import { getAllSchools } from '@/api/organization.service'
import PentilaUtils from 'pentila-utils'

export default {
  name: 'Directory',
  components: {
  },
  inject: ['mq'],
  props: {
  },
  data: function () {
    return {
      searchQuery: '',
      roleList: [],
      selectedRole: undefined,
      emptyRole: { label: 'Tous', roleId: 0 },
      schoolList: [],
      selectedSchool: undefined,
      emptySchool: { schoolName: 'Tous', schoolId: 0 }
    }
  },
  computed: {
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

    // Focus form
    // const input = this.$refs.queryInput
    // input.focus()
    // input.select()
  },
  methods: {
    runSearch () {
      this.$store.dispatch('contact/searchDirectory', { query: this.searchQuery, roleId: this.selectedRole.roleId, schoolId: this.selectedSchool.schoolId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.query {
  width: 80%;
}
.role, .school {
  display: flex;
}
</style>

<i18n locale="fr">
  {
    "queryPlaceholder": "Nom/prénom",
    "search": "Rechercher",
    "role": "Profil",
    "school": "Etablissement"
  }
</i18n>
