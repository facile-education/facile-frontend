<template>
  <NeroToolbar>
    <NeroDropdown
      v-if="managedSchoolList"
      :list="managedSchoolList"
      display-field="schoolName"
      @dropdown-select="onSchoolSelect"
    />
    <NeroSpinner v-else />
    <NeroButton
      class="add-button"
      icon="fa fa-plus"
      @click="onAddWidget"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'
import NeroButton from '@/components/Nero/NeroButton'
import NeroDropdown from '@/components/Nero/NeroDropdown'
import NeroSpinner from '@/components/Nero/NeroSpinner'

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
      this.$store.dispatch('administration/getAdministrationSchools')
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
.add-button {
  margin-left: auto;
}

</style>
