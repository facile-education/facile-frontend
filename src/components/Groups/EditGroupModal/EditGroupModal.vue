<template>
  <PentilaWindow
    :modal="true"
    :is-full-screen="mq.phone"
    data-test="edit-group-modal"
    class="editWindow"
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
          </div>

          <div class="header">
            <div class="checkbox-container">
              <PentilaCheckbox
                v-if="!editedGroup"
                :model-value="isAllSelected"
                label=""
                class="checkbox"
                @update:modelValue="toggleAll"
              />
            </div>
            <div v-t="'identity'" />
            <div v-t="'profile'" />
            <div v-t="'school'" />
          </div>

          <PentilaSpinner v-if="isLoadingCompletion" />
          <GroupUserItem
            v-for="(user, index) in completionUsers"
            :key="index"
            :user="user"
            :is-selected="isGroupMember(user)"
            @toggleUserSelection="editedGroup ? backToggleGroupMember(user) : toggleGroupMember(user)"
          />
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
  getCommunityMembers,
  editCommunity,
  createCommunity,
  addCommunityAdmin,
  removeCommunityAdmin,
  addCommunityMembers,
  removeCommunityMember
} from '@/api/groups.service'
import messageService from '@/api/messaging/message.service'

import ColorPicker from '@/components/Nero/ColorPicker'
import GroupUserItem from '@components/Groups/EditGroupModal/GroupUserItem'
import SelectedGroupMemberItem from '@components/Groups/EditGroupModal/SelectedGroupMemberItem'

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
      groupMembers: [],
      searchInput: ''
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
      return PentilaUtils.Array.sortWithString(this.groupMembers, false, 'userName')
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
  },
  methods: {
    searchTimeOut () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        if (this.searchInput.length >= 2) {
          this.getCompletion(this.searchInput)
        }
      }, 1000)
    },
    getCompletion (query) {
      this.isLoadingCompletion = true
      messageService.getUsersCompletion(query).then((data) => {
        this.isLoadingCompletion = false
        if (data.success) {
          this.completionUsers = data.results
        } else {
          console.error('Error while getting users', data.error)
        }
      })
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
    backToggleGroupMember (member) {
      console.log(this.isCurrentGroupAdmin)
      if (this.isCurrentGroupAdmin) {
        if (this.isGroupMember(member)) {
          removeCommunityMember(this.editedGroup.groupId, member.userId).then((data) => {
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.success'), type: 'success' })
              this.toggleGroupMember(member)
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          })
        } else {
          addCommunityMembers(this.editedGroup.groupId, [member]).then((data) => {
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.success'), type: 'success' })
              this.toggleGroupMember(member)
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          })
        }
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
      if (this.editedGroup) {
        if (member.isAdmin) {
          removeCommunityAdmin(this.editedGroup.groupId, member.userId).then((data) => {
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.success'), type: 'success' })
              member.isAdmin = false
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          })
        } else {
          addCommunityAdmin(this.editedGroup.groupId, member.userId).then((data) => {
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.success'), type: 'success' })
              member.isAdmin = true
            } else {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
            }
          })
        }
      } else {
        member.isAdmin = !member.isAdmin
      }
    },
    deleteGroupMember (member) {
      if (this.editedGroup) {
        removeCommunityMember(this.editedGroup.groupId, member.userId).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.success'), type: 'success' })
            this.toggleGroupMember(member)
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      } else {
        this.toggleGroupMember(member)
      }
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
        editCommunity(this.group.groupId, this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers, this.group.color).then((data) => {
          if (data.success) {
            this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
            this.closeModal()
          }
        })
      } else {
        // Creation
        this.$store.dispatch('groups/createGroup', this.group)
        createCommunity(this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers, this.group.color).then((data) => {
          if (data.success) {
            this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
            this.closeModal()
          }
        })
      }
      this.closeModal()
    },
    closeModal () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

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
  width: 100%;
  margin-top: 15px;

  .user-list {
    position: relative;
    flex: 1;
    padding: 0 10px;
    max-height: 350px;
    overflow: auto;
    border-right: 1px solid #d4d4d4;
    display: flex;
    flex-direction: column;

    .search {
    }

    .header {
      margin-top: 10px;
      display: flex;
      font-weight: 600;
      height: 30px;
      min-height: 30px;

      .checkbox-container{
        width: 26px;
      }

      div {
        width: 100px;
      }
    }
  }

  .group-members {
    flex: 1;
    max-height: 350px;
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
  "admin": "Administrateur"
}
</i18n>
