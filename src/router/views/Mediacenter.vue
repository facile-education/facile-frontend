<template>
  <h1 :aria-label="$t('Mediacenter.serviceTitle')" />
  <NeroToolbar v-if="(schoolList && schoolList.length > 1)">
    <WeprodeDropdown
      v-model="selectedSchool"
      :list="schoolList"
      display-field="schoolName"
      @update:model-value="onSelectSchool"
    />
  </NeroToolbar>

  <CategoryList />
</template>

<script>
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import CategoryList from '@/components/Mediacenter/CategoryList'
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'Mediacenter',
  components: {
    CategoryList,
    NeroToolbar,
    WeprodeDropdown
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
