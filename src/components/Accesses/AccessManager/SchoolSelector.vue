<template>
  <div
    v-if="schoolList && schoolList.length > 1"
    class="school-selection"
  >
    <WeprodeDropdown
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      @update:modelValue="$emit('setSchool', selectedSchool)"
    />
  </div>
</template>

<script>
export default {
  name: 'SchoolSelector',
  emits: ['setSchool'],
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
    },
    selectedSchool: {
      get () {
        return this.$store.state.accessManager.selectedSchool
      },
      set (school) {
        this.$store.dispatch('accessManager/setSelectedSchool', school)
        this.$store.dispatch('accessManager/getSchoolAccesses')
      }
    }
  },
  created () {
    this.selectedSchool = this.schoolList[0]
  }
}
</script>

<style lang="scss" scoped>
.school-selection {
  display: flex;
  justify-content: flex-end;
}
</style>
