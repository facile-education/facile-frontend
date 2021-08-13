<template>
  <NeroToolbar>
    <PentilaDropdown
      v-if="(schoolList && schoolList.length > 1)"
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      @update:modelValue="onSelectSchool"
    />
    <i
      v-if="mq.phone"
      class="selection fa"
      :class="{'fa-user': isSingleUser, 'fa-users': !isSingleUser}"
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
import DatepickerNav from '@/components/Horaires/DatepickerNav'
import userManagementService from '@/api/userManagement.service'

export default {
  name: 'HorairesToolbar',
  components: {
    DatepickerNav,
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
  font-size: 1.2rem;
  padding: 0 0.5rem;
  cursor: pointer;
}

.search {
  max-width: 70%;
}

.date-picker {
  margin-left: auto;
}
</style>
