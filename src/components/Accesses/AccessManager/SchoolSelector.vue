<template>
  <div
    v-if="schoolList && schoolList.length > 1"
    class="school-selection"
  >
    <PentilaDropdown
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
  data () {
    return {
      selectedSchool: undefined
    }
  },
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
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
