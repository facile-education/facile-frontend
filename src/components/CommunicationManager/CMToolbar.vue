<template>
  <NeroToolbar v-if="show">
    <NeroDropdown
      v-if="schools"
      :list="schools"
      display-field="schoolName"
      @dropdown-select="onSchoolSelect"/>
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/NeroToolbar'
import NeroDropdown from '@/components/NeroDropdown'

export default {
  name: 'CMToolbar',
  components: {
    NeroToolbar,
    NeroDropdown
  },
  computed: {
    schools () {
      return this.$store.state.administration.schools
    },
    show () {
      return (this.schools !== undefined && this.schools.length > 1)
    }
  },
  created () {
    if (this.schools === undefined) {
      this.$store.dispatch('getAdministrationSchools')
    }
  },
  methods: {
    onSchoolSelect (school) {
      this.$store.dispatch('setCommunicationManagerSelectedSchoolId', { schoolId: school.schoolId })
      this.$store.dispatch('getSchoolInternalCommunicationRights', { schoolId: school.schoolId })
      this.$store.dispatch('getSchoolExternalCommunicationRights', { schoolId: school.schoolId })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
