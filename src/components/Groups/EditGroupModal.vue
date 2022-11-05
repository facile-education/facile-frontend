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
      </div>

      <PentilaTextArea
        v-model="group.description"
        :placeholder="$t('description')"
        maxlength="75"
        style="height: 120px;"
        class="description"
      />

      <div class="group-is-educationnal">
        <div v-t="'isPedagogical'" />
        <PentilaToggleSwitch
          v-model="group.isPedagogical"
          :title="$t('isPedagogical')"
        />
        <span>Non</span>
      </div>

      <PentilaInput
        v-model="searchInput"
        :placeholder="$t('searchPlaceholder')"
        :maxlength="75"
        @input="searchTimeOut"
      />

      <div class="members">
        <div class="user-list">
          <div class="header">
            <PentilaCheckbox v-model="test" />
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
            @toggleUserSelection="toggleGroupMember(user)"
          />
        </div>

        <div class="group-members">
          <div class="header">
            <div v-t="'admin'" />
          </div>

          <SelectedGroupMemberItem
            v-for="(member, index) in groupMembers"
            :key="index"
            :member="member"
            @toggleAdmin="toggleAdmin(member)"
            @remove="toggleGroupMember(member)"
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
import { getCommunityMembers, editCommunity, createCommunity } from '@/api/groups.service'
import GroupUserItem from '@components/Groups/GroupUserItem'
import SelectedGroupMemberItem from '@components/Groups/SelectedGroupMemberItem'
import messageService from '@/api/messaging/message.service'
// import ColorPicker from '@/components/Nero/ColorPicker'

export default {
  name: 'EditGroupModal',
  components: { SelectedGroupMemberItem, GroupUserItem },
  // components: { ColorPicker },
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
      test: false,
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
    buttonLabel () {
      return this.editedGroup ? this.$t('edit') : this.$t('create')
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
    toggleGroupMember (member) {
      let find = false
      for (let i = 0; i < this.groupMembers.length; ++i) {
        if (member.userId === this.groupMembers[i].userId) {
          find = true
          this.groupMembers.splice(i, 1)
        }
      }
      if (!find) {
        this.groupMembers.push({ ...member, isNew: true })
      }
    },
    isGroupMember (member) {
      this.groupMembers.forEach((groupMember) => {
        if (member.userId === groupMember.userId) {
          return true
        }
      })
      return false
    },
    toggleAdmin (member) {
      member.isAdmin = !member.isAdmin
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
        editCommunity(this.group.groupId, this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers).then((data) => {
          if (data.success) {
            this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
            this.closeModal()
          }
        })
      } else {
        // Creation
        this.$store.dispatch('groups/createGroup', this.group)
        createCommunity(this.group.groupName, this.group.description, this.group.isPedagogical, this.groupMembers).then((data) => {
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

.title-color {
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

.members {
  display: flex;
  width: 100%;

  .user-list {
    position: relative;
    flex: 1;
    margin-top: 20px;
    max-height: 350px;
    overflow: auto;
    border-right: 1px solid #d4d4d4;

    .header {
      display: flex;
      color: blue;
      font-weight: 600;
      height: 50px;

      div {
        width: 100px;
      }
    }
  }

  .group-members {
    flex: 1;
    //margin-top: 20px;
    max-height: 450px;
    overflow: auto;

    .header {
      display: flex;
      justify-content: flex-end;
      color: blue;
      font-size: 12px;
      height: 50px;
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
