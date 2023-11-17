<template>
  <WeprodeWindow
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
      <WeprodeSpinner v-if="isLoading" />

      <div class="group-name">
        <WeprodeInput
          ref="name"
          v-model="group.groupName"
          :placeholder="$t('name')"
          :maxlength="2000"
          @blur="v$.group.groupName.$touch()"
        />
        <WeprodeErrorMessage :error-message="formErrorList.formErrorList" />
      </div>

      <WeprodeTextArea
        v-model="group.description"
        :placeholder="$t('description')"
        maxlength="75"
        class="description"
      />

      <div class="others-fields">
        <div class="group-color">
          <span v-t="'color-selection'" />
          <ColorPicker v-model="group.color" />
        </div>
        <div class="group-is-educational">
          <div
            v-t="'isPedagogical'"
            class="is-educational-label"
          />
          <div class="toggle-section">
            <WeprodeToggleSwitch
              v-model="group.isPedagogical"
              :title="$t('isPedagogical')"
            />
            <span>{{ $t(group.isPedagogical.toString()) }}</span>
          </div>
        </div>
      </div>

      <hr class="theme-border-color">

      <div
        v-if="!mq.phone"
        class="members"
      >
        <div class="user-list">
          <div class="search">
            <WeprodeInput
              v-model="searchInput"
              :placeholder="$t('searchPlaceholder')"
              :maxlength="75"
              @input="searchTimeOut"
            />
            <WeprodeDropdown
              v-model="selectedRole"
              :list="roleList"
              display-field="label"
              :sort="false"
              @update:model-value="getCompletion"
            />
            <WeprodeDropdown
              v-model="selectedSchool"
              :list="schoolList"
              :sort="false"
              display-field="schoolName"
              @update:model-value="getCompletion"
            />
          </div>

          <table
            class="table"
            aria-label="result users"
          >
            <tr>
              <th>
                <WeprodeCheckbox
                  v-if="!editedGroup"
                  :model-value="isAllSelected"
                  label=""
                  class="checkbox"
                  @update:model-value="toggleAll"
                />
              </th>
              <th v-t="'identity'" />
              <th v-t="'profile'" />
              <th v-t="'school'" />
            </tr>
            <GroupUserItem
              v-for="(user, index) in sortedCompletionUsers"
              :key="index"
              :user="user"
              :is-selected="isGroupMember(user)"
              @toggle-user-selection="toggleGroupMember(user)"
            />
          </table>

          <WeprodeSpinner v-if="isLoadingCompletion" />
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
            @toggle-admin="toggleAdmin(member)"
            @remove="deleteGroupMember(member)"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <WeprodeButton
        form="groupform"
        :label="buttonLabel"
        class="confirm-button"
        :disabled="v$.$invalid"
        @click="onConfirm"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import GroupUserItem from '@components/Groups/EditGroupModal/GroupUserItem'
import SelectedGroupMemberItem from '@components/Groups/EditGroupModal/SelectedGroupMemberItem'
import WeprodeUtils from '@utils/weprode.utils'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { nextTick } from 'vue'

import { searchDirectory } from '@/api/contact.service'
import {
  checkCommunityName,
  createCommunity,
  editCommunity,
  getCommunityMembers
} from '@/api/groups.service'
import { getAllSchools } from '@/api/organization.service'
import { getRoleList } from '@/api/role.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeTextArea from '@/components/Base/Weprode/WeprodeTextArea.vue'
import WeprodeToggleSwitch from '@/components/Base/Weprode/WeprodeToggleSwitch.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import ColorPicker from '@/components/Nero/ColorPicker'

export default {
  name: 'EditGroupModal',
  components: { ColorPicker, GroupUserItem, SelectedGroupMemberItem, WeprodeButton, WeprodeCheckbox, WeprodeDropdown, WeprodeErrorMessage, WeprodeInput, WeprodeSpinner, WeprodeTextArea, WeprodeToggleSwitch, WeprodeWindow },
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
      isLoading: false,
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
      return WeprodeUtils.sortArrayWithString(this.groupMembers, false, 'lastName')
    },
    sortedCompletionUsers () {
      return WeprodeUtils.sortArrayWithString(this.completionUsers, false, 'lastName')
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
        this.roleList = [this.emptyRole, ...WeprodeUtils.sortArrayWithString(data.roles, false, 'label')]
      }
    })

    getAllSchools().then((data) => {
      if (data.success) {
        this.selectedSchool = this.emptySchool
        this.schoolList = [this.emptySchool, ...WeprodeUtils.sortArrayWithString(data.schools, false, 'schoolName')]
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
      if (this.searchInput.length >= 2 || this.selectedRole.roleId !== 0) {
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
        this.updateGroup()
      } else {
        // Creation
        // First check if the provided name exists or not
        this.isLoading = true
        checkCommunityName(this.group.groupName).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.createGroup()
          } else {
            // Group already exists
            // Case 1 : community is deactivated and was created by current user -> suggest him to extend and reactivate the group
            if (data.errorCode === 1) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('reactivate-community', { creationDate: dayjs(data.creationDate).format('DD MMM YYYY'), expirationDate: dayjs(data.expirationDate).format('DD MMM YYYY') }), type: 'error' })
            }
            // Case 2 : else, display warning
            if (data.errorCode === 2) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('community-name-exists'), type: 'error' })
            }
          }
        }, (err) => {
          console.error(err)
          this.isLoading = false
        })
      }
    },
    updateGroup () {
      const message = this.$t('edition-success')
      this.isLoading = true
      editCommunity(this.group.groupId, this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers, this.group.color).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.$store.dispatch('groups/getGroupList', { filter: this.$store.state.groups.currentFilter })
          this.$store.dispatch('popups/pushPopup', { message, type: 'success' })
          this.closeModal()
        }
      }, (err) => {
        console.error(err)
        this.isLoading = false
      })
    },
    createGroup () {
      const message = this.$t('creation-success')
      this.isLoading = true
      createCommunity(this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers, this.group.color).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.$store.dispatch('groups/getGroupList', { filter: this.$store.state.groups.currentFilter })
          this.$store.dispatch('popups/pushPopup', { message, type: 'success' })
          this.closeModal()
        }
      }, (err) => {
        console.error(err)
        this.isLoading = false
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

.description {
  width: 100%;
  margin-top: 1rem;
}

.others-fields {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-color{
  span {
    margin-right: 1rem;
  }
}

.group-is-educational {
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
  "color-selection": "Couleur",
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
  "reactivate-community": "Un espace du même nom a été trouvé, créé par vous-même le {creationDate}, et expiré depuis le {expirationDate}. Nous vous invitons à le réactiver.",
  "community-reactivated": "Votre communauté a été réactivée"
}
</i18n>
