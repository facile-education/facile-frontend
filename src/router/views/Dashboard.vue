<template>
  <Layout>
    <h1 :aria-label="$t('serviceTitle')" />
    <div class="dashboard-panel">
      <div class="administration-widgets">
        <DiaryWidget
          v-if="hasDiaryWidget"
          class="diary"
        />
        <AnnouncementsWidget
          v-if="hasSchoolNewsWidget"
          class="announcements"
        />
      </div>
      <PentilaDropdown
        v-if="childList.length > 1"
        v-model="selectedUser"
        :list="childList"
        :sort="false"
        display-field="fullName"
        class="child-selector"
      />
      <div class="personal-widgets">
        <HomeworkWidget
          v-if="hasHomeworkWidget && selectedUser"
          :user-id="selectedUser.userId"
          class="homework"
        />
        <ScheduleWidget
          v-if="hasEDTWidget && selectedUser"
          :user-id="selectedUser.userId"
          class="schedule"
        />
        <ActivityWidget
          v-if="hasActivityThreadWidget"
          class="activity"
        />
        <StatisticWidget
          v-if="hasStatisticWidget"
          class="statistics"
        />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/BannerLayout.vue'
import { defineAsyncComponent } from 'vue'
const AnnouncementsWidget = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/AnnouncementsWidget.vue'))
const DiaryWidget = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/DiaryWidget.vue'))
const ScheduleWidget = defineAsyncComponent(() => import('@components/Dashboard/ScheduleWidget/ScheduleWidget'))
const HomeworkWidget = defineAsyncComponent(() => import('@components/Dashboard/HomeworksWidget/HomeworkWidget.vue'))
const StatisticWidget = defineAsyncComponent(() => import('@components/Dashboard/StatisticsWidget/StatisticsWidget.vue'))
const ActivityWidget = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityWidget.vue'))
export default {
  name: 'Dashboard',
  components: { AnnouncementsWidget, DiaryWidget, ScheduleWidget, HomeworkWidget, StatisticWidget, ActivityWidget, Layout },
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
    hasStatisticWidget () {
      return this.$store.state.dashboard.hasStatisticWidget
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
@import "@design";

.administration-widgets {
  display: flex;
  flex-wrap: wrap;
  gap: 0 3rem;

  .diary {
    flex: 1;
  }

  .announcements {
    flex: 2;
  }
}

.personal-widgets {
  display: flex;
  flex-wrap: wrap;
  gap: 0 3rem;

  .homework {
    flex: 2;
  }

  .schedule {
    flex: 1;
  }

  .statistics {
    flex: 1;
  }
}

</style>

<i18n locale="fr">
{
  "serviceTitle": "Tableau de bord"
}
</i18n>
