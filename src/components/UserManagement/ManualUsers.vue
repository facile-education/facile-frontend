<template>
  <div class="manual-users">
    <PentilaButton
      class="create-user"
      :label="$t('create')"
      @click="createUser"
    />
    <PentilaButton
      class="create-user"
      :label="$t('import')"
      @click="importUser"
    />
    <table
      ref="scroll"
      class="user-table"
      @scroll="handleScroll"
    >
      <thead>
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
            v-t="'login'"
            style="width:10%"
          />
          <th
            v-t="'email'"
            style="width:20%"
          />
          <th
            v-t="'role'"
            style="width:10%"
          />
          <th style="width:10%" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in userList"
          :key="user.userId"
        >
          <td>{{ user.lastName }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.screenName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.roleName }}</td>
          <td>
            <PentilaButton
              @click="editUser(user)"
            >
              <NeroIcon name="pencil-alt" />
            </PentilaButton>
            <PentilaButton
              cls="delete"
              @click="confirmUserRemoval(user)"
            >
              <NeroIcon name="trash" />
            </PentilaButton>
          </td>
        </tr>
      </tbody>
    </table>
    <teleport to="body">
      <EditUserModal
        v-if="isEditUserModalDisplayed"
        height="30em"
        :edited-user="selectedUser"
        @close="isEditUserModalDisplayed = false"
      />
      <ImportUserListModal
        v-if="isImportUserModalDisplayed"
        @close="isImportUserModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import EditUserModal from '@/components/UserManagement/EditUserModal'
import ImportUserListModal from '@/components/UserManagement/ImportUserListModal'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'ManualUsers',
  components: {
    EditUserModal,
    ImportUserListModal,
    NeroIcon
  },
  data () {
    return {
      isEditUserModalDisplayed: false,
      isImportUserModalDisplayed: false,
      pageNb: 0,
      searchText: ''
    }
  },
  computed: {
    isLocked () {
      return this.$store.state.userManagement.isSearchLocked
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    userList () {
      return this.$store.state.userManagement.manualUserList
    }
  },
  watch: {
    selectedSchool (value, oldValue) {
      this.pageNb = 0
      this.$store.commit('userManagement/emptyManualUserList')
      this.runSearch()
    }
  },
  created () {
    this.runSearch()
  },
  unmounted () {
    this.$store.commit('userManagement/emptyManualUserList')
  },
  methods: {
    runSearch () {
      this.$store.dispatch('userManagement/getManualUsers', { schoolId: this.selectedSchool.schoolId, query: this.searchText, pageNb: this.pageNb })
    },
    confirmUserRemoval (user) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.removeUser, params: [user] }
      })
    },
    createUser () {
      this.selectedUser = {}
      this.isEditUserModalDisplayed = true
    },
    editUser (user) {
      this.selectedUser = user
      this.isEditUserModalDisplayed = true
    },
    importUser () {
      this.isImportUserModalDisplayed = true
    },
    removeUser (user) {
      this.$store.dispatch('userManagement/removeManualUser', user)
    },
    handleScroll (e) {
      const scroll = e.target
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
}
</style>

<i18n locale="fr">
{
  "action": "Editer",
  "create": "Créer un nouvel utilisateur",
  "email": "E-mail",
  "firstName": "Prénom",
  "import": "Import par lot",
  "lastName": "Nom",
  "login": "Identifiant",
  "role": "Profil",
  "search": "Recherche",
  "searchPlaceHolder": "Taper le nom et/ou le prénom",
  "warning": "La suppression de cet utilisateur est définitive."
}
</i18n>
