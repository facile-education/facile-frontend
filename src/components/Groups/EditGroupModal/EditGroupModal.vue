<template>
  <PentilaWindow
    :modal="true"
    :full-screen="true"
    data-test="edit-group-modal"
    class="group-edit-window"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'group'" />
    </template>

    <template #body>
      <div class="group-name">
        <PentilaInput
          ref="name"
          v-model="group.groupName"
          :placeholder="$t('name')"
          :maxlength="75"
          @blur="v$.group.groupName.$touch()"
        />
        <PentilaErrorMessage :error-message="formErrorList.formErrorList" />
        <ColorPicker v-model="group.color" />
      </div>

      <PentilaTextArea
        v-model="group.description"
        :placeholder="$t('description')"
        maxlength="75"
        class="description"
      />

      <div class="group-is-educational">
        <div
          v-t="'isPedagogical'"
          class="is-educational-label"
        />
        <div class="toggle-section">
          <PentilaToggleSwitch
            v-model="group.isPedagogical"
            :title="$t('isPedagogical')"
          />
          <span>{{ $t(group.isPedagogical.toString()) }}</span>
        </div>
      </div>

      <hr class="theme-border-color">

      <div
        v-if="!mq.phone"
        class="members"
      >
        <div class="user-list">
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

          <table class="table">
            <tr>
              <th>
                <PentilaCheckbox
                  v-if="!editedGroup"
                  :model-value="isAllSelected"
                  label=""
                  class="checkbox"
                  @update:modelValue="toggleAll"
                />
              </th>
              <th v-t="'identity'" />
              <th v-t="'profile'" />
              <th v-t="'school'" />
            </tr>
            <GroupUserItem
              v-for="(user, index) in completionUsers"
              :key="index"
              :user="user"
              :is-selected="isGroupMember(user)"
              @toggleUserSelection="toggleGroupMember(user)"
            />
          </table>

          <PentilaSpinner v-if="isLoadingCompletion" />
        </div>

        <div class="group-members">
          <div
            v-if="groupMembers.length > 0"
            class="header"
          >
            <div v-t="'admin'" />
          </div>

          <SelectedGroupMemberItem
            v-for="(member, index) in sortedGroupMembers"
            :key="index"
            :member="member"
            :is-current-member="member.userId === currentUser.userId"
            :is-current-group-admin="isCurrentGroupAdmin"
            @toggleAdmin="toggleAdmin(member)"
            @remove="deleteGroupMember(member)"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <PentilaButton
        form="groupform"
        :label="buttonLabel"
        class="confirm-button"
        :disabled="v$.$invalid"
        @click="onConfirm"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { nextTick } from 'vue'
import PentilaUtils from 'pentila-utils'

import {
  createCommunity,
  editCommunity,
  checkCommunityName,
  extendCommunity,
  getCommunityMembers,
  getUsersCompletion
} from '@/api/groups.service'
import { getSchools } from '@/api/organization.service'
import { getRoleList } from '@/api/role.service'

import ColorPicker from '@/components/Nero/ColorPicker'
import GroupUserItem from '@components/Groups/EditGroupModal/GroupUserItem'
import SelectedGroupMemberItem from '@components/Groups/EditGroupModal/SelectedGroupMemberItem'
import dayjs from 'dayjs'

export default {
  name: 'EditGroupModal',
  components: { ColorPicker, GroupUserItem, SelectedGroupMemberItem },
  inject: ['mq'],
  props: {
    editedGroup: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    group: {
      groupName: { required }
    }
  },
  data () {
    return {
      timeout: 0,
      isLoadingCompletion: false,
      group: {
        groupName: '',
        color: '',
        subject: undefined,
        subjectId: 0,
        volee: undefined,
        description: '',
        isPedagogical: false
      },
      completionUsers: [],
      emptyRole: { label: 'Profil', roleId: 0 },
      emptySchool: { schoolName: 'Etablissement', schoolId: 0 },
      groupMembers: [],
      searchInput: '',
      selectedRole: undefined,
      selectedSchool: undefined,
      roleList: [],
      schoolList: []
    }
  },
  computed: {
    buttonLabel () {
      return this.editedGroup ? this.$t('edit') : this.$t('create')
    },
    currentUser () {
      return this.$store.state.user
    },
    formErrorList () {
      const form = this.v$.group.groupName
      if (form.$invalid && form.$dirty) {
        if (form.$errors[0].$validator === 'required') {
          return this.$t('Commons.required')
        } else {
          console.error('Unknown validation error')
          return ''
        }
      } else {
        return ''
      }
    },
    isAllSelected () {
      let returnedValue = this.completionUsers.length > 0
      this.completionUsers.forEach((user) => {
        if (!this.isGroupMember(user)) {
          returnedValue = false
        }
      })
      return returnedValue
    },
    isCurrentGroupAdmin () {
      if (!this.editedGroup) { return true } else { // considered as admin if groupCreation.spec.js
        return this.editedGroup.isAdmin
      }
    },
    sortedGroupMembers () {
      return PentilaUtils.Array.sortWithString(this.groupMembers, false, 'lastName')
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (this.editedGroup && this.editedGroup.groupId > 0) {
      this.getMembers()
    }

    if (this.editedGroup !== undefined) {
      this.group = { ...this.editedGroup }
    }
    nextTick(() => this.$refs.name.$el.childNodes[0].focus())

    getRoleList().then((data) => {
      if (data.success) {
        this.selectedRole = this.emptyRole
        this.roleList = [this.emptyRole, ...PentilaUtils.Array.sortWithString(data.roles, false, 'label')]
      }
    })

    getSchools().then((data) => {
      if (data.success) {
        this.selectedSchool = this.emptySchool
        this.schoolList = [this.emptySchool, ...PentilaUtils.Array.sortWithString(data.schools, false, 'schoolName')]
      }
    })
  },
  methods: {
    searchTimeOut () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.getCompletion()
      }, 1000)
    },
    getCompletion () {
      if (this.searchInput.length >= 2) {
        this.isLoadingCompletion = true
        getUsersCompletion(this.searchInput, this.selectedSchool.schoolId, this.selectedRole.roleId).then((data) => {
          this.isLoadingCompletion = false
          if (data.success) {
            this.completionUsers = data.results
          } else {
            console.error('Error while getting users', data.error)
          }
        })
      }
    },
    toggleAll () {
      if (!this.isAllSelected) {
        this.completionUsers.forEach((user) => {
          if (!this.isGroupMember(user)) {
            this.toggleGroupMember(user)
          }
        })
      } else {
        this.completionUsers.forEach((user) => {
          if (this.isGroupMember(user)) {
            this.toggleGroupMember(user)
          }
        })
      }
    },
    toggleGroupMember (member) {
      let find = false
      for (let i = 0; i < this.groupMembers.length; ++i) {
        if (member.userId === this.groupMembers[i].userId) {
          find = true
          this.groupMembers.splice(i, 1)
        }
      }
      if (!find) {
        this.groupMembers.push({ ...member, isAdmin: false })
      }
    },
    isGroupMember (member) {
      let returnedValue = false
      this.groupMembers.forEach((groupMember) => {
        if (member.userId === groupMember.userId) {
          returnedValue = true
        }
      })
      return returnedValue
    },
    toggleAdmin (member) {
      member.isAdmin = !member.isAdmin
    },
    deleteGroupMember (member) {
      this.toggleGroupMember(member)
    },
    onConfirm (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.submitChanges()
      }
    },
    getMembers () {
      getCommunityMembers(this.editedGroup.groupId).then((data) => {
        if (data.success) {
          this.groupMembers = data.members
        }
      })
    },
    submitChanges () {
      if (this.editedGroup && this.editedGroup.groupId > 0) {
        // Update
        const message = this.$t('edition-success')
        editCommunity(this.group.groupId, this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers, this.group.color).then((data) => {
          if (data.success) {
            this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
            this.$store.dispatch('popups/pushPopup', { message, type: 'info' })
            this.closeModal()
          }
        })
      } else {
        // Creation
        // First check if the provided name exists or not
        checkCommunityName(this.group.groupName).then((data) => {
          if (data.success) {
            const message = this.$t('creation-success')
            createCommunity(this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers, this.group.color).then((data) => {
              if (data.success) {
                this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
                this.$store.dispatch('popups/pushPopup', { message, type: 'info' })
                this.closeModal()
              }
            })
          } else {
            // Group already exists
            // Case 1 : community is deactivated and was created by current user -> suggest him to extend and reactivate the group
            if (data.errorCode === 1) {
              this.$store.dispatch('warningModal/addWarning', {
                text: this.$t('reactivate-community', { creationDate: dayjs(data.creationDate).format('DD MMM YYYY'), expirationDate: dayjs(data.expirationDate).format('DD MMM YYYY') }),
                lastAction: { fct: this.reactivateCommunity, params: [data.groupId] }
              })
            }
            // Case 2 : else, display warning
            if (data.errorCode === 2) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('community-name-exists'), type: 'error' })
            }
          }
        })
      }
    },
    reactivateCommunity (groupId) {
      extendCommunity(groupId).then((data) => {
        if (data.success) {
          this.closeModal()
          this.$store.dispatch('popups/pushPopup', { message: this.$t('community-reactivated'), type: 'info' })
          this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
        }
      })
    },
    closeModal () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.group-edit-window .window-body {
  overflow: auto;
}
</style>

<style lang="scss" scoped>
@import "@design";

.group-name {
  display: flex;
  justify-content: space-between;
  position: relative;

  .group {
    flex-grow: 1;
    margin-right: 10px;
  }

  .error-message {
    position: absolute;
    top: 46px;
  }
}

.description {
  width: 100%;
  margin-top: 20px;
}

.group-is-educational {
  margin-top: 20px;

  .is-educational-label {
    margin-bottom: 5px;
  }
  .toggle-section {
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
    }
  }
}

hr {
  border-top: 1px solid;
  border-bottom: none;
  margin: 20px 0;
}

.members {
  display: flex;
  margin-top: 15px;
  height: calc(100% - 245px);

  .user-list {
    position: relative;
    flex: 1.5;
    padding: 0 10px;
    border-right: 1px solid #d4d4d4;
    overflow: auto;

    .search {
      display: flex;
      gap: 20px;
    }

    .table {
      width: 100%;
      text-align: left;
      margin-top: 20px;
    }
  }

  .group-members {
    flex: 1;
    overflow: auto;

    .header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      height: 30px;
    }
  }
}

.confirm-button {
  width: 130px;
}
</style>

<i18n locale="fr">
{
  "create": "Créer",
  "description": "Description",
  "edit": "Modifier",
  "false": "Non",
  "group": "Groupe",
  "isPedagogical": "Espace à vocation pédagogique",
  "name": "Nom du groupe",
  "true": "Oui",
  "identity": "Identité",
  "profile": "Profil",
  "school": "Établissement",
  "searchPlaceholder": "Rechercher par nom",
  "admin": "Administrateur",
  "creation-success": "Groupe créé",
  "edition-success": "Groupe modifié",
  "community-name-exists": "Un espace existe déjà avec ce nom, merci d'en choisir un autre",
  "reactivate-community": "Un espace du même nom a été trouvé, créé par vous-même le {creationDate}, et expiré depuis le {expirationDate}. Souhaitez-vous le réactiver et prolonger sa durée de vie jusqu'à la fin de l'année scolaire en cours ?",
  "community-reactivated": "Votre communauté a été réactivée"
}
</i18n>
