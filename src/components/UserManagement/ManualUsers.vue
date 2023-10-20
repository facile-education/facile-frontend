<template>
  <div class="manual-users">
    <!-- Header -->
    <div class="header">
      <WeprodeButton
        class="create-user"
        :label="$t('create')"
        @click="createUser"
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
      <WeprodeInput
        ref="tagsinput"
        v-model="filter"
        :maxlength="200"
        :placeholder="$t('nameFilterPlaceholder')"
        @keyup.enter.stop="cleanAndRunSearch"
      />
    </div>

    <!-- Results -->
    <WeprodeSpinner v-if="isLoadingUsers" />
    <div
      v-if="selectedSchool === undefined"
      class="main-label"
    >
      <p>{{ $t('please-select-school') }}</p>
    </div>
    <div
      v-else-if="userList && userList.length === 0"
      class="main-label"
    >
      <p>{{ $t('no-users') }}</p>
    </div>
    <div
      v-else-if="userList"
      ref="scroll"
      class="user-table"
      @scroll="handleScroll"
    >
      <UserFields
        :fields="fields"
      />
      <UserRow
        v-for="user in userList"
        :key="user.userId"
        :fields="fields"
        :user="user"
        @click="editUser(user)"
      />
    </div>
    <teleport to="body">
      <EditUserModal
        v-if="isEditUserModalDisplayed"
        :edited-user="selectedUser"
        @close="isEditUserModalDisplayed = false"
      />
    </teleport>
  </div>
</template>

<script>
import UserFields from '@components/UserManagement/UserFields'
import UserRow from '@components/UserManagement/UserRow'
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import EditUserModal from '@/components/UserManagement/EditUserModal'

let timeout

export default {
  name: 'ManualUsers',
  components: {
    UserRow,
    UserFields,
    EditUserModal,
    WeprodeInput,
    WeprodeSpinner
  },
  data () {
    return {
      isEditUserModalDisplayed: false,
      pageNb: 0,
      filter: '',
      selectedUser: undefined,
      fields: [
        'firstName',
        'lastName',
        'roles'
      ]
    }
  },
  computed: {
    isLoadingUsers () {
      return this.$store.getters['currentActions/isInProgress']('loadUsers')
    },
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    isLocked () {
      return this.$store.state.userManagement.isSearchLocked
    },
    userList () {
      return this.$store.state.userManagement.manualUserList ? WeprodeUtils.sortArrayWithString(this.$store.state.userManagement.manualUserList, false, 'lastName') : undefined
    },
    maxIndex () {
      if (this.$store.state.userManagement.nbTotalResults < this.$store.state.userManagement.nbItemsPerPage) {
        return this.$store.state.userManagement.nbTotalResults
      } else if (this.$store.state.userManagement.nbTotalResults < this.$store.state.userManagement.nbItemsPerPage * (this.pageNb + 1)) {
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
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (this.$refs.tagsinput.inputValue === undefined || this.$refs.tagsinput.inputValue.length >= 2) {
          this.$store.commit('userManagement/emptyManualUserList')
          this.runSearch()
        }
      }, 300)
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
      this.isScrollTopDisplayed = (scroll.scrollTop > 1000)

      if (scroll.scrollTop > this.currentScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        // Load next page if search is not locked
        if (nbPixelsBeforeBottom <= 0 && !this.isLocked) {
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
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: $um-user-header-height;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

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

  .user-table {
    height: calc(100% - #{$um-user-header-height});
    width: 100%;
    display: block;
    overflow: auto;
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
