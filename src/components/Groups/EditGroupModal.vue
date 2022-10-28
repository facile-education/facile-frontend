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
          v-model="test"
          :title="$t('isPedagogical')"
        />
        <span>Non</span>
      </div>

      <PentilaInput
        v-model="searchInput"
        :placeholder="$t('Rechercher par nom')"
        :maxlength="75"
      />

      <!--      <div class="group-is-educationnal">-->
      <!--        <div v-t="'isPedagogical'" />-->
      <!--        <PentilaCheckbox-->
      <!--          v-model="test"-->
      <!--          class="checkbox"-->
      <!--        />-->
      <!--        <span>Oui</span>-->
      <!--      </div>-->

      <div class="members">
        <div class="list-members">
          <div class="header">
            <PentilaCheckbox v-model="test" />
            <div v-t="'Identité'" />
            <div v-t="'Profil'" />
            <div v-t="'Établissement'" />
          </div>

          <GroupMemberItem
            v-for="(member, index) in members"
            :key="index"
            :member="member"
            :is-selected="isSelected(member)"
            @toggleMemberSelection="toggleSelectedMember(member)"
          />
        </div>

        <div class="selected-members">
          <div class="header">
            <div v-t="'Administrateur'" />
          </div>

          <SelectedGroupMemberItem
            v-for="(member, index) in selectedMembers"
            :key="index"
            :member="member"
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
import { getCommunityMembers } from '@/api/groups.service'
import GroupMemberItem from '@components/Groups/GroupMemberItem'
import SelectedGroupMemberItem from '@components/Groups/SelectedGroupMemberItem'
// import ColorPicker from '@/components/Nero/ColorPicker'

export default {
  name: 'EditGroupModal',
  components: { SelectedGroupMemberItem, GroupMemberItem },
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
      test: false,
      group: {
        groupName: '',
        color: '',
        subject: undefined,
        subjectId: 0,
        volee: undefined,
        description: '',
        isPedagogical: false
      },
      members: [],
      selectedMembers: [],
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
    this.getUsers()

    if (this.editedGroup !== undefined) {
      this.group = { ...this.editedGroup }
    }
    nextTick(() => this.$refs.name.$el.childNodes[0].focus())
  },
  methods: {
    toggleSelectedMember (member) {
      this.selectedMembers.push(member)
    },
    isSelected (member) {
      this.selectedMembers.forEach((selectedMember) => {
        if (member.userId === selectedMember.userId) {
          return true
        }
      })
      return false
    },
    onConfirm (e) {
      e.preventDefault()
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.submitChanges()
      }
    },
    getUsers () {
      console.log(this.editedGroup)
      if (this.editedGroup.groupId > 0) {
        getCommunityMembers(this.editedGroup.groupId).then((data) => {
          if (data.success) {
            this.members = data.members
          }
        })
      }
    },
    submitChanges () {
      if (this.editedGroup.groupId > 0) {
        // Update
        this.$store.dispatch('groups/updateGroup', this.group)
      } else {
        // Creation
        this.$store.dispatch('groups/createGroup', this.group)
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

  .list-members {
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

  .selected-members {
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
  "true": "Oui"
}
</i18n>
