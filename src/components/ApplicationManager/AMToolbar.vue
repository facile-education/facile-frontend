<template>
  <NeroToolbar v-if="show">
    <PentilaButton
      v-if="isAdministrator"
      class="create-button"
      :class="{'phone': mq.phone}"
      @click="onAddApplication"
    >
      <NeroIcon name="plus" />
      NOUVEAU
    </PentilaButton>
    <PentilaDropdown
      v-if="managedSchoolList"
      :model-value="selectedSchool"
      :list="managedSchoolList"
      display-field="schoolName"
      class="school-dropdown"
      @update:modelValue="onSchoolSelect"
    />
    <PentilaSpinner v-else />
  </NeroToolbar>
</template>

<script>

import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import NeroToolbar from '@/components/Nero/NeroToolbar'
const NeroIcon = defineAsyncComponent(() => import('@/components/Nero/NeroIcon'))

export default {
  name: 'AMToolbar',
  components: {
    NeroIcon,
    NeroToolbar
  },
  inject: ['mq'],
  computed: {
    managedSchoolList () {
      if (this.$store.state.administration.schoolList === undefined) {
        return []
      }

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
@import "@design";

.create-button{
  @extend %create-button;
}

.school-dropdown {
  margin-left: auto;
}
</style>

<i18n locale="fr">
  {
    "allENT": "Tout l'ENT"
  }
</i18n>
