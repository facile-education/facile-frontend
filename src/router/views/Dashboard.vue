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

      <div class="personal-widgets">
        <ActivityWidget
          v-if="hasActivityThreadWidget"
          class="activities"
        />

        <StatisticWidget
          v-if="hasStatisticWidget"
          class="statistics"
        />

        <div
          v-if="hasEDTWidget || hasHomeworkWidget"
          class="user-selection"
          :class="{'has-homework-widget': hasHomeworkWidget && selectedUser}"
        >
          <div
            v-if="childList.length > 1"
            class="first-line"
          >
            <PentilaDropdown
              v-model="selectedChild"
              :list="childList"
              :sort="false"
              display-field="fullName"
              class="child-selector"
            />
            <div class="line" />
          </div>
          <div class="selected-user-widgets">
            <ScheduleWidget
              v-if="hasEDTWidget && selectedUser"
              :user-id="selectedUser.userId"
              class="schedule"
            />
            <HomeworkWidget
              v-if="hasHomeworkWidget && selectedUser"
              :user-id="selectedUser.userId"
              class="homework"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import Layout from '@/router/layouts/BannerLayout'
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
    },
    selectedChild: {
      get () {
        return this.$store.state.user.selectedChild
      },
      set (child) {
        this.$store.commit('user/setSelectedChild', child)
        this.selectedUser = child
      }
    }
  },
  created () {
    this.$store.dispatch('dashboard/initDashboard').then(() => {
      if (this.childList.length > 0) {
        this.$store.commit('user/setSelectedChild', this.childList[0])
        this.selectedUser = this.selectedChild
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

  .activities {
    flex: 2;
  }

  .statistics {
    flex: 1;
  }
}

.user-selection {
  flex: 1;

  &.has-homework-widget {
    flex: 6
  }
}

.selected-user-widgets {
  display: flex;
  flex-wrap: wrap;
  gap: 0 3rem;

  .homework, .schedule {
    flex: 1;
  }
}

.first-line {
  display: flex;
  align-items: center;

  .line {
    flex: 1;
    margin-left: 1rem;
    height: 1px;
    background-color: $color-border;
  }
}

@media screen and (max-width: 1035px) {
  .personal-widgets {
    flex-direction: column;
  }
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Tableau de bord"
}
</i18n>
