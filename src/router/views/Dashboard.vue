<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <div class="dashboard-panel">
      <!--      <AnnouncementsWidget v-if="hasSchoolNewsWidget" />-->
      <DiaryWidget v-if="hasDiaryWidget" />
      <!--      <HomeworkWidget v-if="hasHomeworkWidget" />-->
      <!--      <EDTWidget v-if="hasEDTWidget" />-->
      <!--      <UserThreadWidget v-if="hasActivityThreadWidget" />-->
      <!--      <StaticWidget v-if="hasStaticWidget" />-->
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
// TODO: import asynchronously
import { defineAsyncComponent } from 'vue'
const DiaryWidget = defineAsyncComponent(() => import('@/components/Dashboard/Diary/DiaryWidget.vue'))
export default {
  name: 'Dashboard',
  components: { DiaryWidget, Layout },
  computed: {
    hasActivityThreadWidget () {
      return this.$store.state.dashboard.hasActivityThreadWidget
    },
    hasSchoolNewsWidget () {
      return this.$store.state.dashboard.hasSchoolNewsWidget
    },
    hasEDTWidget () {
      return this.$store.state.dashboard.hasEDTWidget
    },
    hasHomeworkWidget () {
      return this.$store.state.dashboard.hasHomeworkWidget
    },
    hasDiaryWidget () {
      return this.$store.state.dashboard.hasDiaryWidget
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

<i18n locale="fr">
{
  "serviceTitle": "Tableau de bord"
}
</i18n>
