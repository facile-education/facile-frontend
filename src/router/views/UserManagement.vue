<template>
  <Layout
    :is-allowed="$store.state.user.isSchoolAdmin || $store.state.user.isDirectionMember || $store.state.user.isAdministrator"
    class="layout"
  >
    <h1 :aria-label="$t('serviceTitle')" />

    <div
      v-if="schoolList.length > 1"
      class="header"
    >
      <PentilaDropdown
        v-model="selectedSchool"
        class="dropdown"
        :list="schoolList"
        display-field="schoolName"
      />
    </div>

    <PentilaTabList>
      <PentilaTabItem
        :title="$t('manual-users')"
        class="tab"
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
@import "@design";

.layout {
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    height: $um-ĥeader-height;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    p {
      font-weight: 600;
      font-size: 1.125em;
    }

    .dropdown {
      margin-left: 1em;
    }
  }

  .tabs {
    height: 32px;
  }

  .tab-content {
    padding: 0;
  }

  .tab {
    height: calc(100% - #{$um-ĥeader-height} - 32px);
  }
}

</style>

<i18n locale="fr">
{
  "serviceTitle": "Gestion des utilisateurs",
  "manual-users": "Comptes manuels",
  "delegations": "Délégations",
  "affectations": "Affectations"
}
</i18n>
