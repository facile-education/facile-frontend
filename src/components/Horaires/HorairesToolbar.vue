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
import NeroToolbar from '@/components/Nero/NeroToolbar'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'

export default {
  name: 'HorairesToolbar',
  components: {
    NeroToolbar,
    UserCompletion
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
    onSelectUser (user) {
      if (user) {
        user.userId = (user.studentId) ? user.studentId : user.teacherId
      } else {
        user = { userId: 0 }
      }
      this.$store.dispatch('horaires/selectUser', user)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
