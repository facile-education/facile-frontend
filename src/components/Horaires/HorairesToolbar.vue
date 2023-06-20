<template>
  <NeroToolbar class="toolbar">
    <!-- Create session button -->
    <PentilaButton
      v-if="displayCreateButton"
      class="create-button"
      :class="{'phone': mq.phone}"
      @click="openCreateSessionModal"
    >
      <NeroIcon
        name="fa-plus"
      />
      <span>{{ $t('add') }}</span>
    </PentilaButton>

    <NeroIcon
      v-if="mq.phone"
      :name="iconClass"
      class="selection"
      @click="toggleSelection"
    />

    <!-- Parents with 1 child -->
    <p
      v-if="children.length === 1"
      class="child"
    >
      {{ $t('Horaires.timetableOf') }} {{ children[0].firstName }}
    </p>

    <!-- Group selector for agents -->
    <PentilaDropdown
      v-if="groupList && (!mq.phone || !isSingleUser) && !$store.state.user.isStudent && !$store.state.user.isParent"
      v-model="selectedGroup"
      class="group-list"
      :placeholder="$t('Horaires.groupFilter')"
      :list="groupList"
      display-field="groupName"
    />

    <!-- Name selector for agents -->
    <PentilaTagsInput
      v-if="(!mq.phone || isSingleUser) && !$store.state.user.isStudent && !$store.state.user.isParent"
      v-model="tagsList"
      class="search"
      data-test="user-completion-input"
      :placeholder="$t('Horaires.userInput')"
      :close-on-select="true"
      :max-size="maxSize"
      :completion-only="true"
      :list="autocompleteUserList"
      display-field="displayName"
      id-field="userId"
      @inputChange="searchTimeOut"
      @update:modelValue="onSelectUser"
    />
    <DatepickerNav
      v-if="mq.phone"
      class="date-picker"
      :selected-date="selectedDate"
      @selectDate="onSelectDate"
    />

    <!-- Parents with 2 or more children -->
    <div
      v-if="children.length > 1"
      class="children"
    >
      <p class="children-label">
        {{ $t('Horaires.timetableOf') }}
      </p>
      <PentilaDropdown
        v-model="selectedChild"
        class="children-list"
        :placeholder="$t('Horaires.childFilter')"
        :list="$store.state.user.children"
        display-field="firstName"
      />
    </div>

    <PentilaDropdown
      v-if="(schoolList && schoolList.length > 1)"
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      class="filter"
      @update:modelValue="onSelectSchool"
    />
  </NeroToolbar>
</template>

<script>
import dayjs from 'dayjs'
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import { getSchoolUsers } from '@/api/userSearch.service'
import NeroIcon from '@/components/Nero/NeroIcon'
import NeroToolbar from '@/components/Nero/NeroToolbar'
const DatepickerNav = defineAsyncComponent(() => import('@/components/Horaires/DatepickerNav'))

export default {
  name: 'HorairesToolbar',
  components: {
    DatepickerNav,
    NeroIcon,
    NeroToolbar
  },
  inject: ['mq'],
  props: {
    selectedDate: {
      type: Object,
      default: dayjs()
    }
  },
  emits: ['selectDate'],
  data () {
    return {
      autocompleteUserList: [],
      isSingleUser: true,
      maxSize: 1,
      tagsList: [],
      timeout: undefined
    }
  },
  computed: {
    groupList () {
      return this.$store.state.horaires.groupList
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
        this.$store.dispatch('horaires/selectGroup', group)
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
        this.$store.dispatch('horaires/getSessionList')
      }
    },
    displayCreateButton () {
      for (let index = 0; index < this.$store.state.user.schoolList.length; ++index) {
        if (this.$store.state.user.schoolList[index].schoolId === this.$store.state.user.selectedSchool.schoolId && this.$store.state.user.schoolList[index].isAdmin) {
          return true
        }
      }
      return this.$store.state.user.isAdministrator || this.$store.state.user.isENTAdmin
    }
  },
  created () {
    if (this.groupList === undefined) {
      this.$store.dispatch('horaires/getGroupList')
    }

    // Pre-select him and display sessions if user is a teacher
    if (this.$store.state.user.isTeacher) {
      this.$store.dispatch('horaires/selectUser', this.$store.state.user)

      // Add displayName
      const user = PentilaUtils.JSON.deepCopy(this.$store.state.user)
      user.displayName = this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName
      this.tagsList.push(user)
    }
    this.$store.dispatch('horaires/getSessionList')
  },
  methods: {
    getCompletion (inputValue) {
      getSchoolUsers(this.selectedSchool.schoolId, inputValue).then((data) => {
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
      this.$emit('selectDate', date)
    },
    onSelectUser (userList) {
      if (userList.length) {
        this.$store.dispatch('horaires/selectUser', userList[0])
      } else {
        this.$store.dispatch('horaires/selectUser', { userId: 0 })
        this.autocompleteUserList.length = 0
      }
    },
    onSelectSchool () {
      // TODO : use global school instead of user's school
      this.$store.dispatch('horaires/getGroupList')
      this.tagsList.length = 0
      this.$store.dispatch('horaires/selectGroup', {})
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

<i18n locale="fr">
  {
    "add": "NOUVEAU"
  }
</i18n>
