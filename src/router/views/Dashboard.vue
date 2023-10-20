<template>
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
          <WeprodeDropdown
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
  <teleport
    v-if="isNewsDisplayed && announcement !== undefined"
    to="body"
  >
    <NewsDetailsModal
      :init-news="announcement"
      @close="isNewsDisplayed = false"
    />
  </teleport>
  <teleport
    v-if="isEventDisplayed && event !== undefined"
    to="body"
  >
    <DiaryEventDetailsModal
      :init-event="event"
      @close="isEventDisplayed = false"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { checkDashboardParameter } from '@/api/dashboard.service'
import { setEventRead } from '@/api/dashboard/agenda.service'
import { setNewsRead } from '@/api/dashboard/news.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
const AnnouncementsWidget = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/AnnouncementsWidget.vue'))
const DiaryWidget = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/DiaryWidget.vue'))
const ScheduleWidget = defineAsyncComponent(() => import('@components/Dashboard/ScheduleWidget/ScheduleWidget'))
const HomeworkWidget = defineAsyncComponent(() => import('@components/Dashboard/HomeworksWidget/HomeworkWidget.vue'))
const StatisticWidget = defineAsyncComponent(() => import('@components/Dashboard/StatisticsWidget/StatisticsWidget.vue'))
const ActivityWidget = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityWidget.vue'))
const NewsDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/AnnouncementsWidget/NewsDetailsModal.vue'))
const DiaryEventDetailsModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/DiaryEventDetailsModal.vue'))

export default {
  name: 'Dashboard',
  components: { AnnouncementsWidget, DiaryWidget, ScheduleWidget, HomeworkWidget, StatisticWidget, ActivityWidget, NewsDetailsModal, DiaryEventDetailsModal, WeprodeDropdown },
  emits: ['update:layout'],
  data () {
    return {
      selectedUser: undefined,
      isNewsDisplayed: false,
      announcement: {},
      isEventDisplayed: false,
      event: {}
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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    this.$store.dispatch('dashboard/initDashboard').then(() => {
      if (this.childList.length > 0) {
        this.$store.commit('user/setSelectedChild', this.childList[0])
        this.selectedUser = this.selectedChild
      } else {
        this.selectedUser = this.$store.state.user
      }
      this.$watch(
        () => this.$route.params,
        () => {
          if (this.$route.params.dashboardId) {
            // dashboardId can be either a newsId or an eventId
            const dashboardId = this.$route.params.dashboardId
            checkDashboardParameter(dashboardId).then((data) => {
              if (data.success) {
                if (data.isAuthorized) {
                  if (data.isNews) {
                    setNewsRead(dashboardId, true).then((data) => {
                      if (data.success) {
                        // TODO Reload news to make the read appear
                      }
                    })
                    this.isNewsDisplayed = true
                    this.announcement.newsId = dashboardId
                  } else if (data.isEvent) {
                    setEventRead(dashboardId, true).then((data) => {
                      if (data.success) {
                        // TODO Reload event to make the read appear
                      }
                    })
                    this.isEventDisplayed = true
                    this.event.eventId = dashboardId
                  }
                }
              }
            })
          }
        },
        { immediate: true }
      )
    })
  },
  methods: {
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
  max-width: 100%;

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
