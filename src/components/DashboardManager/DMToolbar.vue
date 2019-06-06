<template>
  <NeroToolbar>
    <PentilaDropdown
      v-if="managedSchoolList"
      v-model="selectedSchool"
      :list="managedSchoolList"
      display-field="schoolName"
      @dropdown-select="onSchoolSelect"
    />
    <PentilaSpinner v-else />
    <PentilaButton
      class="add-button"
      icon="fa fa-plus"
      @click="onAddWidget"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'DMToolbar',
  components: {
    NeroToolbar
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
