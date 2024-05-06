<template>
  <ServicesWrapper
    :is-title-visible="false"
    :title="$t('Mediacenter.serviceTitle')"
  >
    <FacileToolbar v-if="(schoolList && schoolList.length > 1)">
      <WeprodeDropdown
        v-model="selectedSchool"
        :list="schoolList"
        display-field="schoolName"
        @update:model-value="onSelectSchool"
      />
    </FacileToolbar>

    <CategoryList />
  </ServicesWrapper>
</template>

<script>
import FacileToolbar from '@components/Facile/FacileToolbar'

import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import CategoryList from '@/components/Mediacenter/CategoryList'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'Mediacenter',
  components: {
    CategoryList,
    FacileToolbar,
    WeprodeDropdown,
    ServicesWrapper
  },
  emits: ['update:layout'],
  data () {
    return {
      selectedSchool: undefined
    }
  },
  computed: {
    schoolList () {
      return this.$store.state.mediacenter.schoolList
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.$store.dispatch('mediacenter/getSchoolList')
  },
  methods: {
    onSelectSchool (school) {
      this.$store.dispatch('mediacenter/getResourceList', school.schoolId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
