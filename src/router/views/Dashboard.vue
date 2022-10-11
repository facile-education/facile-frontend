<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <div class="dashboard-panel">
      <AnnouncementsWidget v-if="hasSchoolNewsWidget" />
      <HomeworkWidget v-if="hasHomeworkWidget" />
      <EDTWidget v-if="hasEDTWidget" />
      <UserThreadWidget v-if="hasGroupNewsWidget" />
      <!--      <StaticWidget v-if="hasStaticWidget" />-->
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/EmptyLayout'
import UserThreadWidget from '@components/Dashboard/News/UserThreadWidget.vue'
import AnnouncementsWidget from '@components/Dashboard/News/AnnoucementsWidget.vue'
import HomeworkWidget from '@/components/Dashboard/HomeworkWidget.vue'
import EDTWidget from '@/components/Dashboard/EDTWidget.vue'

export default {
  name: 'Dashboard',
  components: { Layout, UserThreadWidget, AnnouncementsWidget, HomeworkWidget, EDTWidget },
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

<i18n locale="fr">
{
  "serviceTitle": "Tableau de bord"
}
</i18n>
