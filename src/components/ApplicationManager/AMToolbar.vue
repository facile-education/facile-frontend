<template>
  <NeroToolbar v-if="show">
    <PentilaDropdown
      v-if="managedSchoolList"
      v-model="selectedSchool"
      :list="managedSchoolList"
      display-field="schoolName"
      @dropdown-select="onSchoolSelect"
    />
    <PentilaSpinner v-else />
    <PentilaButton
      v-if="isAdministrator"
      class="add-button"
      icon="fa fa-plus"
      @click="onAddApplication"
    />
  </NeroToolbar>
</template>

<script>
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'AMToolbar',
  components: {
    NeroToolbar
  },
  computed: {
    managedSchoolList () {
      return this.$store.state.administration.schoolList
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
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
      return (this.isAdministrator ||
        (this.managedSchoolList !== undefined && this.managedSchoolList.length > 1))
    }
  },
  created () {
    if (this.managedSchoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }
  },
  methods: {
    onAddApplication () {
      this.$store.dispatch('applicationManager/resetApplication')
      this.$store.dispatch('applicationManager/openEditionModal')
    },
    onSchoolSelect (school) {
      this.$store.dispatch('applicationManager/getSchoolApplicationList', school)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-button {
  margin-left: auto;
}
</style>
