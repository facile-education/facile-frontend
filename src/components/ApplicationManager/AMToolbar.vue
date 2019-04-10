<template>
  <NeroToolbar v-if="show">
    <NeroDropdown
      v-if="managedSchoolList"
      :list="managedSchoolList"
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
    managedSchoolList () {
      return this.$store.state.administration.schoolList
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
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
