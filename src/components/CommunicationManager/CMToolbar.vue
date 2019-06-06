<template>
  <NeroToolbar v-if="show">
    <Transition
      appear
      name="fade"
    >
      <PentilaDropdown
        v-if="schools"
        v-model="selectedSchool"
        :list="schools"
        display-field="schoolName"
        @dropdown-select="onSchoolSelect"
      />
      <PentilaSpinner v-else />
    </Transition>
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'CMToolbar',
  components: {
    NeroToolbar
  },
  computed: {
    schools () {
      return this.$store.state.administration.schoolList
    },
    selectedSchool: {
      get () {
        return this.$store.state.administration.selectedSchool
      },
      set (school) {
        this.$store.commit('administration/setSelectedSchool', school)
      }
    },
    show () {
      return (this.schools !== undefined && this.schools.length > 1)
    }
  },
  created () {
    if (this.schools === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }
  },
  methods: {
    onSchoolSelect (school) {
      this.$store.dispatch('communicationManager/setCommunicationManagerSelectedSchoolId', { schoolId: school.schoolId })
      this.$store.dispatch('communicationManager/getSchoolInternalCommunicationRights', { schoolId: school.schoolId })
      this.$store.dispatch('communicationManager/getSchoolExternalCommunicationRights', { schoolId: school.schoolId })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
