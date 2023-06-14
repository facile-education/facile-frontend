<template>
  <h1 :aria-label="$t('serviceTitle')" />
  <div
    v-if="schoolList && schoolList.length > 1"
    class="school-selection"
  >
    <PentilaDropdown
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

export default {
  name: 'SchoolScheduleSettings',
  components: { SchoolSlots },
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

<i18n locale="fr">
{
  "serviceTitle": "Gestion des horaires de l'école"
}
</i18n>
