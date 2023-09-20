<template>
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
</template>

<script>
import Affectations from '@/components/UserManagement/Affectations.vue'
import Delegations from '@/components/UserManagement/Delegations'
import ManualUsers from '@/components/UserManagement/ManualUsers'
export default {
  name: 'UserManagement',
  components: {
    ManualUsers,
    Delegations,
    Affectations
  },
  emits: ['update:layout'],
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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

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
</style>

<i18n locale="fr">
{
  "serviceTitle": "Gestion des utilisateurs",
  "manual-users": "Comptes manuels",
  "delegations": "Délégations",
  "affectations": "Affectations"
}
</i18n>
