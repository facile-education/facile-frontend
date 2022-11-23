<template>
  <NeroToolbar v-if="show">
    <PentilaDropdown
      v-if="managedSchoolList"
      :model-value="selectedSchool"
      :list="managedSchoolList"
      display-field="schoolName"
      @update:modelValue="onSchoolSelect"
    />
    <PentilaSpinner v-else />
    <PentilaButton
      v-if="isAdministrator"
      class="add-button"
      @click="onAddApplication"
    >
      <NeroIcon name="plus" />
    </PentilaButton>
  </NeroToolbar>
</template>

<script>

import PentilaUtils from 'pentila-utils'
import NeroToolbar from '@/components/Nero/NeroToolbar'
import { defineAsyncComponent } from 'vue'
const NeroIcon = defineAsyncComponent(() => import('@/components/Nero/NeroIcon'))

export default {
  name: 'AMToolbar',
  components: {
    NeroIcon,
    NeroToolbar
  },
  computed: {
    managedSchoolList () {
      const schoolList = PentilaUtils.JSON.deepCopy(this.$store.state.administration.schoolList)
      if (this.isAdministrator) {
        schoolList.push({ schoolId: 0, schoolName: this.$t('allENT') })
      }
      return schoolList
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    selectedSchool: {
      get () {
        return this.$store.state.administration.selectedSchool
      },
      set (school) {
        this.$store.dispatch('administration/setSelectedSchool', school)
        this.$store.dispatch('administration/getClassList')
      }
    },
    show () {
      return (this.isAdministrator ||
        (this.managedSchoolList !== undefined && this.managedSchoolList.length > 1))
    }
  },
  methods: {
    onAddApplication () {
      this.$store.dispatch('applicationManager/resetApplication')
      this.$store.dispatch('applicationManager/openEditionModal')
    },
    onSchoolSelect (school) {
      this.selectedSchool = school
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

<i18n locale="fr">
  {
    "allENT": "Tout l'ENT"
  }
</i18n>
