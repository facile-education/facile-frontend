<template>
  <div
    class="affectations"
  >
    <!-- Header -->
    <div class="header">
      <PentilaButton
        class="add-affected-user"
        :label="$t('add-affected-user')"
        @click="openAddAffectedUserModal()"
      />
      <PentilaInput
        ref="nameInput"
        v-model="filter"
        :maxlength="200"
        :placeholder="$t('nameFilterPlaceholder')"
        @keyup.enter.stop="cleanAndRunSearch"
      />
    </div>
    <div
      v-if="selectedSchool === undefined"
      class="main-label"
    >
      <p>{{ $t('please-select-school') }}</p>
    </div>
    <div
      v-else-if="sortedAffectedUsers.length === 0"
      class="main-label"
    >
      <p>{{ $t('no-affectation') }}</p>
    </div>
    <div
      v-else
      class="affected-users"
    >
      <UserFields
        :fields="fields"
      />
      <div class="user-list">
        <UserRow
          v-for="user in sortedAffectedUsers"
          :key="user.userId"
          :fields="fields"
          :user="user"
          @click="editUserAffectations(user)"
        />
      </div>
    </div>
    <teleport to="body">
      <AddAffectedUserModal
        v-if="isAddAffectedUserModalDisplayed"
        height="30em"
        @close="isAddAffectedUserModalDisplayed = false"
        @new-users="newUsers"
      />
      <UserAffectationsModal
        v-if="isUserAffectationsModalDisplayed"
        height="30em"
        :edited-user="selectedUser"
        @close="isUserAffectationsModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>

import PentilaUtils from 'pentila-utils'
import UserAffectationsModal from '@/components/UserManagement/UserAffectationsModal.vue'
import AddAffectedUserModal from '@/components/UserManagement/AddAffectedUserModal.vue'
import UserFields from '@components/UserManagement/UserFields'
import UserRow from '@components/UserManagement/UserRow'

export default {
  name: 'Affectations',
  components: {
    UserRow,
    UserFields,
    UserAffectationsModal,
    AddAffectedUserModal
  },
  data () {
    return {
      filter: '',
      selectedUser: undefined,
      isAddAffectedUserModalDisplayed: false,
      isUserAffectationsModalDisplayed: false,
      fields: [
        'firstName',
        'lastName',
        'roles',
        'affectations'
      ]
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    sortedAffectedUsers () {
      return PentilaUtils.Array.sortWithString(this.$store.state.userManagement.affectedUsers, false, 'lastName')
    }
  },
  watch: {
    selectedSchool () {
      this.cleanAndRunSearch()
    },
    filter () {
      this.cleanAndRunSearch()
    }
  },
  created () {
    this.cleanAndRunSearch()
  },
  methods: {
    cleanAndRunSearch () {
      this.pageNb = 0
      this.$store.commit('userManagement/emptyAffectedUserList')
      this.$store.dispatch('userManagement/getAffectedUsers', { schoolId: this.selectedSchool.schoolId, query: this.filter })
    },
    editUserAffectations (user) {
      this.selectedUser = user
      this.isUserAffectationsModalDisplayed = true
    },
    nbAffectations (user) {
      return user.affectations === undefined ? 0 : user.affectations.length
    },
    openAddAffectedUserModal () {
      this.isAddAffectedUserModalDisplayed = true
    },
    newUsers (users) {
      this.$store.dispatch('userManagement/addAffectedUsers', users)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.affectations {
  height: 100%;
}

.header {
  height: $um-user-header-height;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-label {
  margin-top: 10em;
  text-align: center;
}

.affected-users {
  height: calc(100% - #{$um-user-header-height});

  .user-list {
    height: calc(100% - #{$um-fields-height});
    overflow: auto;
  }
}

</style>

<i18n locale="fr">
{
  "nameFilterPlaceholder": "Filtrer par nom/prénom",
  "add-affected-user": "Ajouter une affectation",
  "please-select-school": "Veuillez sélectionner un établissement",
  "no-affectation": "Aucune affectation pour cet établissement",
  "lastName": "Nom",
  "firstName": "Prénom",
  "role": "Profil",
  "nbAffectations": "Nombre d'affectations",
  "edit-affectations": "Editer"
}
</i18n>
