<template>
  <FacileToolbar v-if="show">
    <Transition
      appear
      name="fade"
    >
      <WeprodeDropdown
        v-if="managedSchoolList"
        :model-value="selectedSchool"
        :list="managedSchoolList"
        display-field="schoolName"
        @update:model-value="onSchoolSelect"
      />
      <WeprodeSpinner v-else />
    </Transition>
  </FacileToolbar>
</template>

<script>
import FacileToolbar from '@components/Facile/FacileToolbar'

import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'CMToolbar',
  components: {
    FacileToolbar,
    WeprodeDropdown,
    WeprodeSpinner
  },
  computed: {
    managedSchoolList () {
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
      return (this.managedSchoolList !== undefined && this.managedSchoolList.length > 1)
    }
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }
  },
  methods: {
    onSchoolSelect (school) {
      this.selectedSchool = school
      this.$store.dispatch('communicationManager/setCommunicationManagerSelectedSchoolId', { schoolId: school.schoolId })
      this.$store.dispatch('communicationManager/getSchoolInternalCommunicationRights', { schoolId: school.schoolId })
      this.$store.dispatch('communicationManager/getSchoolExternalCommunicationRights', { schoolId: school.schoolId })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
