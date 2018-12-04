<template>
  <NeroToolbar v-if="show">
    <NeroButton
      v-if="isAdministrator"
      icon="fa fa-plus"
      @click="onAddApplication"
    />
    <NeroDropdown
      v-if="schools"
      :list="schools"
      display-field="schoolName"
      @dropdown-select="onSchoolSelect"
    />
    <NeroSpinner v-else />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/NeroToolbar'
import NeroButton from '@/components/NeroButton'
import NeroDropdown from '@/components/NeroDropdown'
import NeroSpinner from '@/components/NeroSpinner'

export default {
  name: 'AMToolbar',
  components: {
    NeroButton,
    NeroToolbar,
    NeroDropdown,
    NeroSpinner
  },
  computed: {
    schools () {
      return this.$store.state.administration.schoolList
    },
    isAdministrator () {
      return this.$store.state.currentUser.isAdministrator
    },
    show () {
      return (this.isAdministrator ||
        (this.schools !== undefined && this.schools.length > 1))
    }
  },
  created () {
    if (this.schools === undefined) {
      this.$store.dispatch('getAdministrationSchools')
    }
  },
  methods: {
    onAddApplication () {
      this.$store.dispatch('resetApplication')
      this.$store.dispatch('openEditionModal')
    },
    onSchoolSelect (school) {
      this.$store.dispatch('getSchoolApplications', { school })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
