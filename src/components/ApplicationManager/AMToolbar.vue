<template>
  <NeroToolbar v-if="show">
    <NeroDropdown
      v-if="schools"
      :list="schools"
      display-field="schoolName"
      @dropdown-select="onSchoolSelect"
    />
    <NeroSpinner v-else />
    <NeroButton
      v-if="isAdministrator"
      class="add-button"
      icon="fa fa-plus"
      @click="onAddApplication"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'
import NeroButton from '@/components/Nero/NeroButton'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroSpinner from '@/components/Nero/NeroSpinner'

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
      return this.$store.state.user.isAdministrator
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
.add-button {
  right: 5px;
  position: absolute;
}
</style>
