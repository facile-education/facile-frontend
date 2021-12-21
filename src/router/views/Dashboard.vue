<template>
  <Layout>
    <div class="dashboard-panel">
      <GroupNewsWidget v-if="hasGroupNewsWidget" />
      <SchoolNewsWidget v-if="hasSchoolNewsWidget" />
      <HomeworkWidget v-if="hasHomeworkWidget" />
      <EDTWidget v-if="hasEDTWidget" />
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import GroupNewsWidget from '@components/Dashboard/News/GroupNewsWidget.vue'
import SchoolNewsWidget from '@/components/Dashboard/News/SchoolNewsWidget.vue'
import HomeworkWidget from '@/components/Dashboard/HomeworkWidget.vue'
import EDTWidget from '@/components/Dashboard/EDTWidget.vue'

export default {
  name: 'Dashboard',
  components: { Layout, GroupNewsWidget, SchoolNewsWidget, HomeworkWidget, EDTWidget },
  computed: {
    hasGroupNewsWidget () {
      return this.$store.state.dashboard.hasGroupNewsWidget
    },
    hasSchoolNewsWidget () {
      return this.$store.state.dashboard.hasSchoolNewsWidget
    },
    hasEDTWidget () {
      return this.$store.state.dashboard.hasEDTWidget
    },
    hasHomeworkWidget () {
      return this.$store.state.dashboard.hasHomeworkWidget
    }
  },
  created () {
    this.$store.dispatch('dashboard/initDashboard') // Get user's widget list
  }
}
</script>

<style lang="scss" scoped>
.dashboard-panel {
  display: flex;
  flex-wrap: wrap;
}
</style>
