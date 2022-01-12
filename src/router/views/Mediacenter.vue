<template>
  <Layout
    class="layout"
  >
    <NeroToolbar v-if="(schoolList && schoolList.length > 1)">
      <PentilaDropdown
        v-model="selectedSchool"
        :list="schoolList"
        display-field="schoolName"
        @update:modelValue="onSelectSchool"
      />
    </NeroToolbar>

    <CategoryList />
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import CategoryList from '@/components/Mediacenter/CategoryList'
import NeroToolbar from '@/components/Nero/NeroToolbar'

export default {
  name: 'Mediacenter',
  components: {
    CategoryList,
    Layout,
    NeroToolbar
  },
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
.layout {
  height: 100%;
}
</style>
