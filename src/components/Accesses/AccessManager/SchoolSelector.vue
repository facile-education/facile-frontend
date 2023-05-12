<template>
  <div
    v-if="schoolList && schoolList.length > 1"
    class="school-selection"
  >
    <PentilaDropdown
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      @update:modelValue="$emit('setSchool')"
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

</style>
