<template>
  <NeroToolbar v-if="show">
    <Transition
      appear
      name="fade"
    >
      <NeroDropdown
        v-if="schools"
        :list="schools"
        display-field="schoolName"
        @dropdown-select="onSchoolSelect"
      />
      <NeroSpinner v-else />
    </Transition>
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroSpinner from '@/components/Nero/NeroSpinner'

export default {
  name: 'CMToolbar',
  components: {
    NeroToolbar,
    NeroDropdown,
    NeroSpinner
  },
  computed: {
    schools () {
      return this.$store.state.administration.schoolList
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
