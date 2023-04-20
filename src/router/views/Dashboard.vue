<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <div class="dashboard-panel">
      <PentilaDropdown
        v-if="childList.length > 1"
        v-model="selectedUser"
        :list="childList"
        display-field="fullName"
      />
      <AnnouncementsWidget v-if="hasSchoolNewsWidget" />
      <DiaryWidget v-if="hasDiaryWidget" />
      <HomeworkWidget
        v-if="hasHomeworkWidget && selectedUser"
        :user-id="selectedUser.userId"
      />
      <EDTWidget
        v-if="hasEDTWidget && selectedUser"
        :user-id="selectedUser.userId"
      />
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
const HomeworkWidget = defineAsyncComponent(() => import('@components/Dashboard/Homeworks/HomeworkWidget.vue'))
export default {
  name: 'Dashboard',
  components: { AnnouncementsWidget, DiaryWidget, EDTWidget, HomeworkWidget, Layout },
  data () {
    return {
      selectedUser: undefined
    }
  },
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
    },
    childList () {
      return this.$store.state.dashboard.childList
    }
  },
  created () {
    this.$store.dispatch('dashboard/initDashboard').then(() => {
      if (this.childList.length > 0) {
        this.selectedUser = this.childList[0]
      } else {
        this.selectedUser = this.$store.state.user
      }
    })
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
