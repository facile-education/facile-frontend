<template>
  <Layout
    class="layout"
  >
    <div
      class="tabs"
    >
      <div
        class="tab"
        @click="toggleManualUsers"
      >
        <p>{{ $t('manual-users') }}</p>
        <div
          v-if="isManualUsersMode"
          class="active-line theme-background-color"
        />
      </div>
      <div
        class="tab"
        @click="toggleManualAffectation"
      >
        <p>{{ $t('manual-affectation') }}</p>
        <div
          v-if="isManualAffectationMode"
          class="active-line theme-background-color"
        />
      </div>
      <div
        class="tab"
        @click="toggleSchoolAdmin"
      >
        <p>{{ $t('school-admins') }}</p>
        <div
          v-if="isSchoolAdminMode"
          class="active-line theme-background-color"
        />
      </div>
      <div
        class="tab"
        @click="toggleChangePassword"
      >
        <p>{{ $t('passwords') }}</p>
        <div
          v-if="isPasswordMode"
          class="active-line theme-background-color"
        />
      </div>
    </div>
    <ManualUsers v-if="isManualUsersMode" />
    <ManualAffectation v-if="isManualAffectationMode" />
    <SchoolAdmin v-if="isSchoolAdminMode" />
    <ChangePassword v-if="isPasswordMode" />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import ManualUsers from '@/components/UserManagement/ManualUsers.vue'
import ChangePassword from '@/components/UserManagement/ChangePassword.vue'
import SchoolAdmin from '@/components/UserManagement/SchoolAdmin.vue'
import ManualAffectation from '@/components/UserManagement/ManualAffectation.vue'

export default {
  name: 'UserManagement',
  components: {
    Layout,
    ManualUsers,
    ChangePassword,
    SchoolAdmin,
    ManualAffectation
  },
  computed: {
    isManualUsersMode () {
      return this.$store.state.userManagement.isManualUsersMode
    },
    isPasswordMode () {
      return this.$store.state.userManagement.isPasswordMode
    },
    isManualAffectationMode () {
      return this.$store.state.userManagement.isManualAffectationMode
    },
    isSchoolAdminMode () {
      return this.$store.state.userManagement.isSchoolAdminMode
    }
  },
  created () {
  },
  methods: {
    toggleManualUsers () {
      this.$store.dispatch('userManagement/setManualUsersMode')
    },
    toggleChangePassword () {
      this.$store.dispatch('userManagement/setChangePasswordMode')
    },
    toggleManualAffectation () {
      this.$store.dispatch('userManagement/setManualAffectationMode')
    },
    toggleSchoolAdmin () {
      this.$store.dispatch('userManagement/setSchoolAdminMode')
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  .tabs {
    padding: 5px;
    display: flex;

    .tab {
      align-content: center;
      text-align: center;
      padding-left: 20px;
      &:hover {
        cursor: pointer;
      }
      p {
        margin: 0;
        padding-bottom: 5px;
        font-size: 0.875rem;
      }
      .active-line {
        height: 3px;
        width: 140px;
      }
    }
  }

}
</style>

<i18n locale="fr">
{
  "manual-users": "Utilisateurs manuels",
  "manual-affectation": "Affectations classes",
  "school-admins": "Administrateurs",
  "passwords": "Mots de passe"
}
</i18n>
