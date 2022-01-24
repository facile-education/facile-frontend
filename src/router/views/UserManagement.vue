<template>
  <Layout
    :is-allowed="$store.state.user.isSchoolAdmin || $store.state.user.isAdministrator"
    class="layout"
  >
    <NeroToolbar v-if="(schoolList && schoolList.length > 1)">
      <PentilaDropdown
        v-model="selectedSchool"
        :list="schoolList"
        display-field="schoolName"
      />
    </NeroToolbar>
    <Transition
      appear
      name="fade"
    >
      <PentilaTabList style="height: calc(100% - 60px);">
        <PentilaTabItem
          :title="$t('manual-users')"
          style="height: calc(100% - 30px);"
        >
          <ManualUsers />
        </PentilaTabItem>
        <!-- <PentilaTabItem :title="$t('manual-affectation')">
          <ManualAffectation />
        </PentilaTabItem> -->
        <PentilaTabItem :title="$t('school-admins')">
          <SchoolAdmin />
        </PentilaTabItem>
        <PentilaTabItem :title="$t('gar-admins')">
          <GARAdmin />
        </PentilaTabItem>
      </PentilaTabList>
    </Transition>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import NeroToolbar from '@/components/Nero/NeroToolbar.vue'
import ManualUsers from '@/components/UserManagement/ManualUsers'
import SchoolAdmin from '@/components/UserManagement/SchoolAdmin'
import GARAdmin from '@/components/UserManagement/GARAdmin'
// import ManualAffectation from '@/components/UserManagement/ManualAffectation'

export default {
  name: 'UserManagement',
  components: {
    GARAdmin,
    Layout,
    ManualUsers,
    // ManualAffectation,
    NeroToolbar,
    SchoolAdmin
  },
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
    },
    selectedSchool: {
      get () {
        return this.$store.state.user.selectedSchool
      },
      set (school) {
        this.$store.commit('user/setSelectedSchool', school)
      }
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}
</style>

<i18n locale="fr">
{
  "gar-admins": "Administrateurs GAR",
  "manual-users": "Utilisateurs manuels",
  "manual-affectation": "Affectations classes",
  "school-admins": "Administrateurs"
}
</i18n>
