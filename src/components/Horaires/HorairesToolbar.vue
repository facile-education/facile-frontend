<template>
  <NeroToolbar>
    <PentilaDropdown
      v-if="(schoolList && schoolList.length > 1)"
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      @update:modelValue="onSelectSchool"
    />
    <NeroIcon
      v-if="mq.phone"
      :name="iconClass"
      class="selection"
      @click="toggleSelection"
    />
    <PentilaDropdown
      v-if="groupList && (!mq.phone || !isSingleUser)"
      v-model="selectedGroup"
      :placeholder="$t('Horaires.groupFilter')"
      :list="groupList"
      display-field="groupName"
    />
    <PentilaTagsInput
      v-if="!mq.phone || isSingleUser"
      v-model="tagsList"
      class="search"
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
  </NeroToolbar>
</template>

<script>
import dayjs from 'dayjs'

import NeroToolbar from '@/components/Nero/NeroToolbar'
import NeroIcon from '@/components/Nero/NeroIcon'
import userManagementService from '@/api/userManagement.service'

import { defineAsyncComponent } from 'vue'
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
    }
  },
  created () {
    if (this.groupList === undefined) {
      this.$store.dispatch('horaires/getGroupList')
    }
  },
  methods: {
    getCompletion (inputValue) {
      userManagementService.getSchoolUsers(this.selectedSchool.schoolId, inputValue).then((data) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.selection {
  font-size: 2.3rem;
  padding: 0 0.5rem;
  cursor: pointer;
}

.search {
  max-width: 70%;
}

.date-picker {
  margin-left: auto;
}

.base-dropdown {
  margin-right: .4rem;
}
</style>
