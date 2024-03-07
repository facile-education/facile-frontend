<template>
  <div
    class="toolbar"
    :class="{'phone': mq.phone}"
  >
    <!-- Create session button -->
    <WeprodeButton
      v-if="displayCreateButton"
      class="create-button"
      :class="{'phone': mq.phone}"
      @click="openCreateSessionModal"
    >
      <CustomIcon icon-name="icon-plus" />
      <span>{{ $t('Horaires.HorairesToolbar.add') }}</span>
    </WeprodeButton>

    <div class="filters">
      <!-- To switch between user selection and group selection -->
      <button
        v-if="mq.phone && !$store.state.user.isStudent && !$store.state.user.isParent"
        :aria-label="$t('Horaires.HorairesToolbar.toggleGroupsFilter')"
        :title="$t('Horaires.HorairesToolbar.toggleGroupsFilter')"
        class="toggle-group-filter-button"
        @click="toggleSelection"
      >
        <FAIcon
          :name="iconClass"
          class="selection"
        />
      </button>

      <!-- Parents with 1 child -->
      <p
        v-if="children.length === 1"
        class="child"
      >
        {{ $t('Horaires.HorairesToolbar.timetableOf') }} {{ children[0].firstName }}
      </p>

      <!-- Group selector for agents -->
      <WeprodeDropdown
        v-if="groupList && (!mq.phone || !isSingleUser) && !$store.state.user.isStudent && !$store.state.user.isParent"
        v-model="selectedGroup"
        class="group-list"
        :placeholder="$t('Horaires.HorairesToolbar.groupFilter')"
        :list="groupList"
        display-field="groupName"
      />

      <!-- Name selector for agents -->
      <WeprodeTagsInput
        v-if="(!mq.phone || isSingleUser) && !$store.state.user.isStudent && !$store.state.user.isParent"
        v-model="tagsList"
        class="search"
        data-test="user-completion-input"
        :placeholder="$t('Horaires.HorairesToolbar.userInput')"
        :close-on-select="true"
        :max-size="maxSize"
        :completion-only="true"
        :list="autocompleteUserList"
        display-field="displayName"
        id-field="userId"
        @input-change="searchTimeOut"
        @update:model-value="onSelectUser"
      />

      <!-- Parents with 2 or more children -->
      <div
        v-if="children.length > 1"
        class="children"
      >
        <p class="children-label">
          {{ $t('Horaires.HorairesToolbar.timetableOf') }}
        </p>
        <WeprodeDropdown
          v-model="selectedChild"
          class="children-list"
          :placeholder="$t('Horaires.HorairesToolbar.childFilter')"
          :list="$store.state.user.children"
          display-field="firstName"
        />
      </div>

      <DatepickerNav
        v-if="mq.phone"
        class="date-picker"
        :selected-date="selectedDate"
        @select-date="onSelectDate"
      />

      <WeprodeDropdown
        v-if="(schoolList && schoolList.length > 1)"
        v-model="selectedSchool"
        :list="schoolList"
        display-field="schoolName"
        class="filter"
        @update:model-value="onSelectSchool"
      />
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import WeprodeUtils from '@utils/weprode.utils'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import groupService from '@/api/groups.service'
import { getSchoolMembers } from '@/api/userSearch.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeTagsInput from '@/components/Base/Weprode/WeprodeTagsInput.vue'
const DatepickerNav = defineAsyncComponent(() => import('@/components/Horaires/DatepickerNav'))

export default {
  name: 'HorairesToolbar',
  components: {
    CustomIcon,
    DatepickerNav,
    WeprodeButton,
    WeprodeDropdown,
    WeprodeTagsInput
  },
  inject: ['mq'],
  emits: ['updateSessions'],
  data () {
    return {
      autocompleteUserList: [],
      isSingleUser: true,
      maxSize: 1,
      tagsList: [],
      groupList: undefined,
      timeout: undefined
    }
  },
  computed: {
    defaultGroup () {
      return this.$store.state.horaires.defaultGroup
    },
    selectedDate () {
      return this.$store.state.horaires.selectedDate
    },
    iconClass () {
      return this.isSingleUser ? 'fa-user' : 'fa-users'
    },
    schoolList () {
      return this.$store.state.user.schoolList
    },
    children () {
      return this.$store.state.user.children
    },
    selectedGroup: {
      get () {
        return this.$store.state.horaires.selectedGroup
      },
      set (group) {
        this.tagsList.length = 0
        this.$store.dispatch('horaires/setSelectedGroup', group)
        this.$emit('updateSessions')
      }
    },
    selectedSchool: {
      get () {
        return this.$store.state.user.selectedSchool
      },
      set (school) {
        this.$store.commit('user/setSelectedSchool', school)
      }
    },
    selectedChild: {
      get () {
        return this.$store.state.user.selectedChild
      },
      set (child) {
        this.$store.commit('user/setSelectedChild', child)
        this.$store.dispatch('horaires/setSelectedUser', child)
        this.$emit('updateSessions')
      }
    },
    displayCreateButton () {
      for (const school of this.$store.state.user.schoolList) {
        if (school.schoolId === this.$store.state.user.selectedSchool.schoolId && school.isAdmin) {
          return true
        }
      }
      return this.$store.state.user.isAdministrator || this.$store.state.user.isENTAdmin
    }
  },
  watch: {
    // This is used after creating a manual session
    selectedGroup () {
      if (this.$store.state.horaires.selectedGroup.groupId !== 0) {
        this.tagsList.length = 0
      }
    }
  },
  created () {
    if (this.groupList === undefined && !this.$store.state.user.isStudent && !this.$store.state.user.isParent) {
      this.getGroupList()
    }
    if (this.$route.query.fromUserCard) {
      const user = { ...this.$store.state.userCard.userToDisplay, displayName: this.$store.state.userCard.userToDisplay.firstName + ' ' + this.$store.state.userCard.userToDisplay.lastName }
      this.tagsList.push(user)
      this.$store.dispatch('userCard/initUserCard', undefined)
    } else if (this.$store.state.user.isTeacher) {
      // Add displayName
      const user = WeprodeUtils.deepCopy(this.$store.state.user)
      user.displayName = this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName
      this.tagsList.push(user)
    }
  },
  methods: {
    getGroupList () {
      groupService.getUserGroups(
        (this.$store.state.user.selectedSchool.schoolId !== undefined) ? this.$store.state.user.selectedSchool.schoolId : 0,
        true,
        true,
        true
      ).then((data) => {
        if (data.success) {
          this.groupList = [this.defaultGroup, ...data.groups]
          this.$store.dispatch('horaires/setSelectedGroup', this.defaultGroup)
        } else {
          console.error('error')
        }
      },
      (err) => {
        console.error(err)
      })
    },
    getCompletion (inputValue) {
      getSchoolMembers(this.selectedSchool.schoolId, inputValue).then((data) => {
        if (data.success) {
          if (data.users.length > 0) {
            this.autocompleteUserList = data.users
            this.autocompleteUserList.forEach((user) => {
              user.displayName = `${user.lastName} ${user.firstName}` +
                (user.className ? ` (${user.className})` : '') +
                (user.isTeacher ? ' (Maitre)' : '')
            })
          }
        } else {
          console.error('Error while getting user completion', data.error) // TODO: better error gesture
        }
      })
    },
    onSelectDate (date) {
      this.$store.dispatch('horaires/setSelectedDate', dayjs(date))
      this.$emit('updateSessions')
    },
    onSelectUser (userList) {
      if (userList.length) {
        this.$store.dispatch('horaires/setSelectedUser', userList[0])
      } else {
        this.$store.dispatch('horaires/setSelectedUser', undefined)
        this.autocompleteUserList.length = 0
      }
      this.$emit('updateSessions')
    },
    onSelectSchool () {
      // TODO : use global school instead of user's school
      this.getGroupList()
      this.tagsList.length = 0
      this.$store.dispatch('horaires/setSelectedGroup', undefined)
      this.$emit('updateSessions')
    },
    searchTimeOut (inputValue) {
      clearTimeout(this.timeout)
      // Make a new timeout set to go off in 800ms
      if (inputValue.length >= 2) { // nbCharBeforeCompletion
        this.timeout = setTimeout(() => {
          this.getCompletion(inputValue)
        }, 500)
      } else {
        this.autocompleteUserList.length = 0
      }
    },
    toggleSelection () {
      this.isSingleUser = !this.isSingleUser
    },
    openCreateSessionModal () {
      this.$store.dispatch('horaires/setCreateSessionModalDisplayed', true)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 0.8rem;

  z-index: $toolbar-z-index;

  &.phone {
    flex-direction: column;

    .search {
      flex: 1;
      max-width: none;
    }
  }
}

.filters {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.toggle-group-filter-button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
}

.create-button {
  @extend %create-button;
}

.selection {
  font-size: 2.3rem;
  padding: 0 0.5rem;
  cursor: pointer;
}

.children {
  display: flex;
  justify-content: space-between;

  .children-label {
    padding-left: 1rem;
    padding-right: .4rem;
    margin: auto;
  }
  .children-list {
    margin: auto;
  }
}

.child {
  padding-left: 1rem;
  margin-top: 0px;
  margin-bottom: 0px;
}

.search {
  max-width: 70%;
}

.date-picker {
  margin-left: auto;
}

.filter {
  margin-left: auto;
}
</style>
