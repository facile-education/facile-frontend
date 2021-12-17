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
        <p>Utilisateurs manuels</p>
        <div
          v-if="isManualUsersMode"
          class="active-line theme-background-color"
        />
      </div>
      <div
        class="tab"
        @click="toggleManualAffectation"
      >
        <p>Affectation classes</p>
        <div
          v-if="isManualAffectationMode"
          class="active-line theme-background-color"
        />
      </div>
      <div
        class="tab"
        @click="toggleChangePassword"
      >
        <p>Mots de passe</p>
        <div
          v-if="isPasswordMode"
          class="active-line theme-background-color"
        />
      </div>
    </div>
    <ManualUsers v-if="isManualUsersMode" />
    <ManualAffectation v-if="isManualAffectationMode" />
    <ChangePassword v-if="isPasswordMode" />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import ManualUsers from '@/components/UserManagement/ManualUsers.vue'
import ChangePassword from '@/components/UserManagement/ChangePassword.vue'
import ManualAffectation from '@/components/UserManagement/ManualAffectation.vue'

export default {
  name: 'UserManagement',
  components: {
    Layout,
    ManualUsers,
    ChangePassword,
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
