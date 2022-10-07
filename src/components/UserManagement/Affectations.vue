<template>
  <div
    class="affectations"
  >
    <!-- Header -->
    <div class="header">
      <PentilaInput
        ref="nameInput"
        v-model="filter"
        :maxlength="200"
        :placeholder="$t('nameFilterPlaceholder')"
        @keyup.enter.stop="cleanAndRunSearch"
      />
      <PentilaButton
        class="add-affected-user"
        :label="$t('add-affected-user')"
        @click="openAddAffectedUserModal()"
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
      <table style="width:100%">
        <tr>
          <th
            v-t="'lastName'"
            style="width:25%"
          />
          <th
            v-t="'firstName'"
            style="width:25%"
          />
          <th
            v-t="'role'"
            style="width:25%"
          />
          <th
            v-t="'nbAffectations'"
            style="width:15%"
          />
          <th
            v-t="'edit-affectations'"
            style="width:10%"
          />
        </tr>
        <tr
          v-for="affectedUser in sortedAffectedUsers"
          :key="affectedUser.userId"
          class="affected-user"
        >
          <td><span>{{ affectedUser.lastName }}</span></td>
          <td><span>{{ affectedUser.firstName }}</span></td>
          <td><span>{{ affectedUser.roles }}</span></td>
          <td><div class="center">{{ nbAffectations(affectedUser) }}</div></td>
          <td>
            <div>
              <img
                class="button"
                src="@assets/edit.svg"
                :alt="$t('edit-affectations')"
                :title="$t('edit-affectations')"
                @click.stop="editUserAffectations(affectedUser)"
              >
            </div>
          </td>
        </tr>
      </table>
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

export default {
  name: 'Affectations',
  components: {
    UserAffectationsModal,
    AddAffectedUserModal
  },
  data () {
    return {
      filter: '',
      selectedUser: undefined,
      isAddAffectedUserModalDisplayed: false,
      isUserAffectationsModalDisplayed: false
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
  padding: 10px;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: 5px;
  margin-bottom: 20px;
  .add-affected-user {
    margin-right: 10px;
  }
}

.main-label {
  margin-top: 10em;
  text-align: center;
}
.affected-users {
  table tr:nth-child(odd){
    background-color:rgb(223, 223, 223)
  }
  .affected-user {
    height: 2em;
    td {
      span {
        margin-left: 5px;
      }
      .center {
        margin: auto;
        text-align: center;
      }
      .button {
        margin: auto;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
      }
    }
  }
}

</style>

<i18n locale="fr">
{
  "nameFilterPlaceholder": "Filtrer par nom/prénom",
  "add-affected-user": "Ajouter un utilisateur",
  "please-select-school": "Veuillez sélectionner un établissement",
  "no-affectation": "Aucune affectation pour cet établissement",
  "lastName": "Nom",
  "firstName": "Prénom",
  "role": "Profil",
  "nbAffectations": "Nombre d'affectations",
  "edit-affectations": "Editer"
}
</i18n>
