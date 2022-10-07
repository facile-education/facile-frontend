<template>
  <div class="manual-users">
    <!-- Header -->
    <div class="header">
      <PentilaInput
        ref="nameInput"
        v-model="filter"
        :maxlength="200"
        :placeholder="$t('nameFilterPlaceholder')"
        @keyup.enter.stop="cleanAndRunSearch"
      />
      <div
        v-if="nbTotalResults > 0"
        class="pagination"
      >
        <span>{{ $t('display') }}</span>
        <span>{{ $t('to') }}</span>
        <span>{{ maxIndex }}</span>
        <span>{{ $t('over') }}</span>
        <span>{{ nbTotalResults }}</span>
      </div>
      <PentilaButton
        class="create-user"
        :label="$t('create')"
        @click="createUser"
      />
    </div>

    <!-- Results -->
    <div
      v-if="selectedSchool === undefined"
      class="main-label"
    >
      <p>{{ $t('please-select-school') }}</p>
    </div>
    <div
      v-else-if="userList.length === 0"
      class="main-label"
    >
      <p>{{ $t('no-users') }}</p>
    </div>
    <div v-else>
      <table
        ref="scroll"
        class="user-table"
        @scroll="handleScroll"
      >
        <thead>
          <tr>
            <th
              v-t="'lastName'"
              style="width:40%"
            />
            <th
              v-t="'firstName'"
              style="width:30%"
            />
            <th
              v-t="'role'"
              style="width:30%"
            />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in userList"
            :key="user.userId"
            class="manual-user"
            @click="editUser(user)"
          >
            <td>{{ user.lastName }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.roleName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <teleport to="body">
      <EditUserModal
        v-if="isEditUserModalDisplayed"
        height="30em"
        :edited-user="selectedUser"
        @close="isEditUserModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import EditUserModal from '@/components/UserManagement/EditUserModal'

export default {
  name: 'ManualUsers',
  components: {
    EditUserModal
  },
  data () {
    return {
      isEditUserModalDisplayed: false,
      pageNb: 0,
      filter: ''
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    isLocked () {
      return this.$store.state.userManagement.isSearchLocked
    },
    userList () {
      return PentilaUtils.Array.sortWithString(this.$store.state.userManagement.manualUserList, false, 'lastName')
    },
    maxIndex () {
      if (this.$store.state.userManagement.nbTotalResults < this.$store.state.userManagement.nbItemsPerPage) {
        return this.$store.state.userManagement.nbTotalResults
      } else {
        return this.$store.state.userManagement.nbItemsPerPage * (this.pageNb + 1)
      }
    },
    nbTotalResults () {
      return this.$store.state.userManagement.nbTotalResults
    }
  },
  watch: {
    selectedSchool () {
      this.cleanAndRunSearch()
    },
    filter (value) {
      this.cleanAndRunSearch()
    }
  },
  created () {
    this.cleanAndRunSearch()
  },
  unmounted () {
    this.$store.commit('userManagement/emptyManualUserList')
  },
  methods: {
    cleanAndRunSearch () {
      this.pageNb = 0
      this.$store.commit('userManagement/emptyManualUserList')
      this.runSearch()
    },
    runSearch () {
      this.$store.dispatch('userManagement/getManualUsers', { schoolId: this.selectedSchool.schoolId, query: this.filter, pageNb: this.pageNb, nbItemsPerPage: this.$store.state.userManagement.nbItemsPerPage })
    },
    createUser () {
      this.selectedUser = {}
      this.isEditUserModalDisplayed = true
    },
    editUser (user) {
      this.selectedUser = user
      this.isEditUserModalDisplayed = true
    },
    removeUser (user) {
      this.$store.dispatch('userManagement/removeManualUser', user)
    },
    handleScroll (e) {
      const scroll = e.target
      console.log('scroll', scroll)
      this.isScrollTopDisplayed = (scroll.scrollTop > 1000)

      if (scroll.scrollTop > this.currentScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        // Load next page if search is not locked
        if (nbPixelsBeforeBottom === 0 && !this.isLocked) {
          ++this.pageNb
          this.runSearch()
        }
      }
      this.currentScrollTop = scroll.scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.manual-users {
  padding: 10px;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: 5px;
  margin-bottom: 20px;
  .pagination {
    margin: auto;
  }
  span {
    margin-right: 4px;
  }
}

.main-label {
  margin-top: 10em;
  text-align: center;
}

.create-user {
  margin-right: 10px;
}

.user-table {
  width:100%;
  display: block;
  overflow: auto;height: calc(100% - 38px);

  thead {
    position: sticky;
    top: 0;
    background-color: white;
  }

  th {
    text-align: left;
  }
  tr {
    height: 2em;
  }
  .manual-user {
    &:hover {
      background-color: lightblue;
      cursor: pointer;
    }
  }
}
</style>

<i18n locale="fr">
{
  "action": "Editer",
  "display": "Résultats 1",
  "to": "à",
  "over": "sur un total de",
  "create": "Ajouter un utilisateur",
  "no-users" : "Aucun compte manuel pour cet établissement",
  "please-select-school": "Veuillez sélectionner un établissement",
  "email": "E-mail",
  "firstName": "Prénom",
  "lastName": "Nom",
  "login": "Identifiant",
  "role": "Profil",
  "search": "Recherche",
  "nameFilterPlaceholder": "Filtrer par nom / prénom"
}
</i18n>
