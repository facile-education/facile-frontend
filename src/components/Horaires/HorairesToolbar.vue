<template>
  <NeroToolbar>
    <PentilaDropdown
      v-if="schoolList && schoolList.length > 1"
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
    />
    <PentilaDropdown
      v-if="groupList"
      v-model="selectedGroup"
      :list="groupList"
      display-field="groupName"
    />
    <PentilaTagsInput
      v-model="tagsList"
      placeholder="Elève / Maitre"
      :close-on-select="true"
      :max-size="maxSize"
      :completion-only="true"
      :list="autocompleteUserList"
      display-field="displayName"
      id-field="userId"
      @inputChange="searchTimeOut"
      @update:modelValue="onSelectUser"
    />
  </NeroToolbar>
</template>

<script>
import cdtService from '@/api/cdt.service'

import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'HorairesToolbar',
  components: {
    NeroToolbar
  },
  data () {
    return {
      autocompleteUserList: [],
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
      cdtService.getSchoolUsers(this.selectedSchool.schoolId, inputValue).then((data) => {
        if (data.success) {
          if (data.users.length > 0) {
            this.autocompleteUserList = data.users
            this.autocompleteUserList.forEach((user) => {
              user.displayName = `${user.firstName} ${user.lastName}` +
                (user.className ? ` (${user.className})` : '') +
                (user.isTeacher ? ' (Maitre)' : '')
            })
          }
        } else {
          console.error('Error while getting user completion', data.error) // TODO: better error gesture
        }
      })
    },
    onSelectUser (userList) {
      if (userList.length) {
        this.$store.dispatch('horaires/selectUser', userList[0])
      } else {
        this.$store.dispatch('horaires/selectUser', { userId: 0 })
        this.autocompleteUserList.length = 0
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
