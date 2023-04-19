<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <div class="dashboard-panel">
      <AnnouncementsWidget v-if="hasSchoolNewsWidget" />
      <DiaryWidget v-if="hasDiaryWidget" />
      <HomeworkWidget v-if="hasHomeworkWidget" />
      <EDTWidget v-if="hasEDTWidget" />
      <!--      <UserThreadWidget v-if="hasActivityThreadWidget" />-->
      <!--      <StatisticWidget v-if="hasStatisticWidget" />-->
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout.vue'
import { defineAsyncComponent } from 'vue'
const AnnouncementsWidget = defineAsyncComponent(() => import('@components/Dashboard/Announcements/AnnouncementsWidget.vue'))
const DiaryWidget = defineAsyncComponent(() => import('@/components/Dashboard/Diary/DiaryWidget.vue'))
const EDTWidget = defineAsyncComponent(() => import('@/components/Dashboard/EDTWidget.vue'))
const HomeworkWidget = defineAsyncComponent(() => import('@/components/Dashboard/HomeworkWidget.vue'))
export default {
  name: 'Dashboard',
  components: { AnnouncementsWidget, DiaryWidget, EDTWidget, HomeworkWidget, Layout },
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
  gap: 10%;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Tableau de bord"
}
</i18n>
