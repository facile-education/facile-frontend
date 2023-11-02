<template>
  <NeroToolbar v-if="show">
    <WeprodeButton
      v-if="isAdministrator"
      class="create-button"
      :class="{'phone': mq.phone}"
      @click="onAddApplication"
    >
      <NeroIcon name="plus" />
      NOUVEAU
    </WeprodeButton>
    <WeprodeDropdown
      v-if="managedSchoolList"
      :model-value="selectedSchool"
      :list="managedSchoolList"
      display-field="schoolName"
      class="school-dropdown"
      @update:model-value="onSchoolSelect"
    />
    <WeprodeSpinner v-else />
  </NeroToolbar>
</template>

<script>

import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import NeroToolbar from '@/components/Nero/NeroToolbar'
const NeroIcon = defineAsyncComponent(() => import('@/components/Nero/NeroIcon'))

export default {
  name: 'AMToolbar',
  components: {
    NeroIcon,
    NeroToolbar,
    WeprodeButton,
    WeprodeDropdown,
    WeprodeSpinner
  },
  inject: ['mq'],
  computed: {
    managedSchoolList () {
      if (this.$store.state.administration.schoolList === undefined) {
        return []
      }

      const schoolList = WeprodeUtils.deepCopy(this.$store.state.administration.schoolList)
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
    "allENT": "Tout l'ENTA"
  }
</i18n>
