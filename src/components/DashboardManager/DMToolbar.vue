<template>
  <NeroToolbar>
    <NeroButton
      icon="fa fa-plus"
      @click="onAddWidget"
    />
    <NeroDropdown
      v-if="managedSchoolList"
      :list="managedSchoolList"
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
  name: 'DMToolbar',
  components: {
    NeroButton,
    NeroToolbar,
    NeroDropdown,
    NeroSpinner
  },
  computed: {
    managedSchoolList () {
      return this.$store.state.administration.schoolList
    }
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('getAdministrationSchools')
    }
  },
  methods: {
    onAddWidget () {
      // TODO widget
      this.$store.dispatch('dashboardManager/openEditionModal', { config: { schools: [] } })
    },
    onSchoolSelect (school) {
      this.$store.dispatch('dashboardManager/getSchoolWidgetList', school)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
