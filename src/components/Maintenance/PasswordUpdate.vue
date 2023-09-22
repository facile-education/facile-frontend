<template>
  <div class="main">
    <div class="banner">
      <div class="search">
        <PentilaInput
          v-model="searchInput"
          :placeholder="$t('searchPlaceholder')"
          :maxlength="75"
          @input="searchTimeOut"
        />
        <PentilaDropdown
          v-model="selectedRole"
          :list="roleList"
          display-field="label"
          :sort="false"
          @update:modelValue="getCompletion"
        />
        <PentilaDropdown
          v-model="selectedSchool"
          :list="schoolList"
          :sort="false"
          display-field="schoolName"
          @update:modelValue="getCompletion"
        />
      </div>
      <div class="password">
        <PentilaInput
          v-model="password1"
          :placeholder="$t('passwordPlaceholder')"
          :maxlength="75"
        />
        <PentilaButton
          class="round"
          @click="updatePassword"
        >
          <span>{{ $t('update-password') }}</span>
        </PentilaButton>
      </div>
    </div>

    <table class="table">
      <tr>
        <th v-t="'identity'" />
        <th v-t="'profile'" />
        <th v-t="'screenName'" />
        <th v-t="'school'" />
      </tr>
      <tr
        v-for="(user, index) in completionUsers"
        :key="index"
        class="user"
        :class="{'selected' : isSelected(user)}"
        @click.stop="toggleUserSelection(user)"
      >
        <td>{{ fullName(user) }}</td>
        <td>{{ user.roles }}</td>
        <td>{{ user.screenName }}</td>
        <td>{{ user.schoolName }}</td>
      </tr>
    </table>

    <PentilaSpinner v-if="isLoadingCompletion" />
  </div>
</template>

<script>

import PentilaUtils from 'pentila-utils'

import { searchDirectory } from '@/api/contact.service'
import { getAllSchools } from '@/api/organization.service'
import { getRoleList } from '@/api/role.service'
import { updatePasswordByManager } from '@/api/userManagement.service'

export default {
  name: 'PasswordUpdate',
  data () {
    return {
      password1: '',
      timeout: 0,
      isLoadingCompletion: false,
      completionUsers: [],
      emptyRole: { label: 'Profil', roleId: 0 },
      emptySchool: { schoolName: 'Etablissement', schoolId: 0 },
      searchInput: '',
      selectedRole: undefined,
      selectedSchool: undefined,
      roleList: [],
      schoolList: [],
      selectedUser: undefined
    }
  },
  computed: {
  },
  created () {
    getRoleList().then((data) => {
      if (data.success) {
        this.selectedRole = this.emptyRole
        this.roleList = [this.emptyRole, ...PentilaUtils.Array.sortWithString(data.roles, false, 'label')]
      }
    })

    getAllSchools().then((data) => {
      if (data.success) {
        this.selectedSchool = this.emptySchool
        this.schoolList = [this.emptySchool, ...PentilaUtils.Array.sortWithString(data.schools, false, 'schoolName')]
      }
    })
  },
  methods: {
    fullName (user) {
      return user.lastName + ' ' + user.firstName
    },
    searchTimeOut () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.getCompletion()
      }, 1000)
    },
    getCompletion () {
      if (this.searchInput.length >= 2) {
        this.isLoadingCompletion = true
        searchDirectory(this.searchInput, this.selectedRole.roleId, this.selectedSchool.schoolId).then((data) => {
          this.isLoadingCompletion = false
          if (data.success) {
            this.completionUsers = data.users
          } else {
            console.error('Error while getting users', data.error)
          }
        })
      }
    },
    toggleUserSelection (user) {
      this.selectedUser = user
    },
    isSelected (user) {
      return this.selectedUser !== undefined && user.userId === this.selectedUser.userId
    },
    updatePassword () {
      updatePasswordByManager(this.selectedUser.userId, this.password1).then((data) => {
        if (data.success) {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('success'), type: 'success' })
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  flex: 1.5;
  padding: 0 10px;
  overflow: auto;

  .banner {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .search {
    display: flex;
    gap: 20px;
  }

  .password {
    display: flex;
    gap: 20px;
  }
  .table {
    width: 60%;
    text-align: left;
    margin-top: 20px;
  }
  .user {
    &:hover {
      cursor: pointer;
    }
  }
  .selected {
    background-color: lightblue;
  }
}
</style>

<i18n locale="fr">
{
  "identity": "Identité",
  "profile": "Profil",
  "screenName": "Login",
  "school": "Établissement",
  "searchPlaceholder": "Rechercher par nom",
  "passwordPlaceholder": "Nouveau mot de passe",
  "update-password": "Changer le mot de passe",
  "success": "Mot de passe changé avec succès",
  "error": "Erreur lors du changement de mot de passe"
}
</i18n>
