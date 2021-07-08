<template>
  <NeroToolbar>
    <PentilaDropdown
      v-if="schoolList && schoolList.length > 1"
      :model-value="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      @update:modelValue="onSelectSchool"
    />
    <PentilaDropdown
      v-if="groupList"
      v-model="selectedGroup"
      :list="groupList"
      display-field="groupName"
    />
    <UserCompletion
      user-type="teacher"
      placeholder="Enseignant"
      @selectUser="onSelectUser"
    />
    <UserCompletion
      v-if="false"
      user-type="student"
      placeholder="Elève"
      @selectUser="onSelectUser"
    />
  </NeroToolbar>
</template>

<script>
import cdtService from '@/api/cdt.service'

import NeroToolbar from '@/components/Nero/NeroToolbar'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'

export default {
  name: 'HorairesToolbar',
  components: {
    NeroToolbar,
    UserCompletion
  },
  data () {
    return {
      groupList: undefined
    }
  },
  computed: {
    schoolList () {
      return this.$store.state.user.schoolList
    },
    selectedGroup: {
      get () {
        return this.$store.state.horaires.selectedGroup
      },
      set (group) {
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
      cdtService.getGroups().then(
        (data) => {
          if (data.success) {
            this.groupList = [...data.schools[0].groups, ...data.schools[1].groups]
            // commit('setSessionList', data.sessions)
          } else {
            console.error('Cannot get sessions ')
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        }
      )
    }
  },
  methods: {
    onSelectSchool (school) {
      this.selectedSchool = school
    },
    onSelectUser (user) {
      user.userId = (user.studentId) ? user.studentId : user.teacherId
      this.$store.dispatch('horaires/selectUser', user)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
