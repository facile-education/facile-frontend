<template>
  <Layout
    :is-allowed="$store.state.user.isSchoolAdmin || $store.state.user.isDirectionMember || $store.state.user.isAdministrator"
    class="layout"
  >
    <div class="header">
      <div class="header-title">
        <p>{{ $t('title') }}</p>
        <PentilaDropdown
          v-if="schoolList.length > 1"
          v-model="selectedSchool"
          :list="schoolList"
          display-field="schoolName"
        />
        <p
          v-else
          class="school-name"
        >
          {{ selectedSchool.schoolName }}
        </p>
      </div>
    </div>

    <Transition
      appear
      name="fade"
    >
      <PentilaTabList
        style="height: calc(100% - 60px);"
        class="tablist"
      >
        <PentilaTabItem
          :title="$t('manual-users')"
          class="tab"
          style="height: calc(100% - 30px);"
        >
          <ManualUsers />
        </PentilaTabItem>
        <PentilaTabItem
          :title="$t('delegations')"
          class="tab"
        >
          <Delegations />
        </PentilaTabItem>
        <PentilaTabItem
          :title="$t('affectations')"
          class="tab"
        >
          <Affectations />
        </PentilaTabItem>
      </PentilaTabList>
    </Transition>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import ManualUsers from '@/components/UserManagement/ManualUsers'
import Delegations from '@/components/UserManagement/Delegations'
import Affectations from '@/components/UserManagement/Affectations.vue'

export default {
  name: 'UserManagement',
  components: {
    Layout,
    ManualUsers,
    Delegations,
    Affectations
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
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  background-color: rgb(233, 233, 233);
}
.header {
  width: 100%;
  margin-top: 1em;
  margin-bottom: 1em;
  .header-title {
    display: flex;
    margin: auto;
    width: 50%;
    p {
      margin-right: 1em;
      font-weight: bold;;
    }
    .school-name {
      font-weight: normal;
    }
  }
}
.tablist {
  background-color: white;
}
</style>

<i18n locale="fr">
{
  "title": "Gestion des utilisateurs de ",
  "manual-users": "Comptes manuels",
  "delegations": "Délégations",
  "affectations": "Affectations"
}
</i18n>
