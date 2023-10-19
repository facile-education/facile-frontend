<template>
  <WeprodeDropdown
    v-if="userSchools.length > 1"
    v-model="selectedSchool"
    class="dropdown"
    :list="userSchools"
    display-field="schoolName"
  />
</template>

<script>
export default {
  name: 'SelectedSchool',
  computed: {
    selectedSchool: {
      get () {
        return this.$store.state.user.selectedSchool
      },
      set (school) {
        this.$store.commit('user/setSelectedSchool', school)
      }
    },
    userSchools () {
      return this.$store.state.user.schoolList
    }
  }
}
</script>

<style scoped>
.dropdown {
  margin: 15px 0;
}
</style>
