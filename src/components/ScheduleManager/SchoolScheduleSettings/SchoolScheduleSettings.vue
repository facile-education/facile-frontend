<template>
  <h1 :aria-label="$t('ScheduleManager.SchoolScheduleSettings.serviceTitle')" />
  <div
    v-if="schoolList && schoolList.length > 1"
    class="school-selection"
  >
    <WeprodeDropdown
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
    />
  </div>

  <SchoolSlots
    v-if="selectedSchool"
    :selected-school="selectedSchool"
  />
</template>

<script>
import SchoolSlots from '@components/ScheduleManager/SchoolScheduleSettings/SchoolSlots.vue'

import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'

export default {
  name: 'SchoolScheduleSettings',
  components: { SchoolSlots, WeprodeDropdown },
  computed: {
    schoolList () {
      return this.$store.getters['user/adminSchoolList']
    },
    selectedSchool: {
      get () {
        return this.$store.state.user.selectedSchool
      },
      set (school) {
        this.$store.dispatch('user/setSelectedSchool', school)
      }
    }
  },
  created () {
    if (!this.schoolList || this.schoolList.length === 0) {
      this.$store.dispatch('user/initUserInformations')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
