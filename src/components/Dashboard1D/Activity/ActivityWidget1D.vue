<template>
  <section
    data-test="activity-widget-1D"
    class="activity-widget-1D"
    :class="{'infinite-scroll' : displayAll}"
  >
    <ActivityHeader1D
      :is-displayed-show-more="readActivities.length > 0 || unreadActivities.length > 0"
      :display-all="displayAll"
    />
    <div class="activity-filter">
      <WeprodeDropdown
        v-if="(isTeacher || isParent) && (teacherClasses.length > 0 || currentUser.children.length > 0)"
        v-model="selectedDropDownValue"
        :list="isTeacher ? teacherClasses : currentUser.children"
        :display-field="isTeacher ? 'className' : 'firstName'"
        :filtered="true"
        :sort="false"
      />
    </div>
    <div
      v-if="error === true"
      v-t="'Dashboard.ActivityWidget.errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="readActivities.length === 0 && unreadActivities.length === 0 && !isFirstLoad"
      v-t="'Dashboard.ActivityWidget.emptyPlaceholder'"
      class="placeholder"
    />
    <div
      v-else
      ref="scroll"
      class="activities"
      @scroll="handleScroll"
    >
      <ul v-if="unreadActivities.length !== 0 && isAllLoaded">
        <li
          v-for="activity in sortedUnreadActivities"
          :key="activity.activityId"
        >
          <ActivityItem
            :activity="activity"
            :is-unread="true"
            :is-last="activity.activityId === lastActivity.activityId"
            :is-dashboard="true"
            @mark-as-read="activity.hasRead=true"
            @get-next-activities="loadActivities"
            @refresh="refresh"
          />
        </li>
      </ul>

      <div
        v-if="unreadActivities.length !== 0 && readActivities.length !== 0"
        class="separator theme-border-color"
      >
        {{ separatorLabel }}
      </div>

      <ul v-if="readActivitiesToDisplay.length !== 0 && isAllLoaded">
        <li
          v-for="activity in readActivitiesToDisplay"
          :key="activity.activityId"
        >
          <ActivityItem
            :activity="activity"
            :is-last="activity.activityId === lastActivity.activityId"
            :is-dashboard="true"
            @get-next-activities="loadActivities"
            @refresh="refresh"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getDashboard1DActivity } from '@/api/dashboard.service'
import { getUserCommunities } from '@/api/groups.service'
import activityConstants from '@/constants/activityConstants'
import { allActivitiesPaginationSize1D, nbActivityInWidget1D } from '@/constants/dashboardConstants'

import WeprodeDropdown from '../../../components/Base/Weprode/WeprodeDropdown.vue'
import ActivityItem from '../../Dashboard/ActivityWidget/ActivityItem.vue'
import ActivityHeader1D from './ActivityHeader1D.vue'
let oldScrollTop = 0

export default {
  name: 'ActivityWidget1D',
  components: {
    ActivityHeader1D,
    WeprodeDropdown,
    ActivityItem
  },
  props: {
    displayAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      error: false,
      readActivities: [],
      unreadActivities: [],
      lastDashboardAccessDate: undefined,
      pageNumber: 0,
      isAllLoaded: false,
      isFirstLoad: true,
      teacherClasses: [{
        classId: 0,
        className: 'Toutes mes classes',
        index: 1
      }],
      dropDownSelection: undefined
    }
  },
  computed: {
    nbActivitiesPerPage () {
      return this.displayAll ? allActivitiesPaginationSize1D : nbActivityInWidget1D
    },
    currentUser () {
      return this.$store.state.user
    },
    isParent () {
      return this.$store.state.user.isParent
    },
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    separatorLabel () {
      return this.$t('Dashboard.ActivityWidget.newsSince', { date: dayjs(this.lastDashboardAccessDate, DATE_EXCHANGE_FORMAT).calendar() })
    },
    selectedDropDownValue: {
      get () {
        if (this.isTeacher) {
          return this.currentUser.selectedClass ? this.currentUser.selectedClass : this.teacherClasses[0]
        } else {
          return this.currentUser.selectedChild
        }
      },
      set (value) {
        if (this.isTeacher) {
          this.$store.commit('user/setSelectedClass', value)
        } else {
          this.$store.commit('user/setSelectedChild', value)
        }
        this.refresh(value)
        console.log(this.currentUser)
        console.log(this.teacherClasses)
      }
    },
    sortedUnreadActivities () {
      // Unread news first then sort by publication date
      const activities = this.unreadActivities
      activities.sort((a1, a2) => {
        if (a1.type === activityConstants.TYPE_NEWS && a2.type !== activityConstants.TYPE_NEWS) {
          return 1
        } else {
          return dayjs(a1.modificationDate).isBefore(dayjs(a2.modificationDate))
        }
      })
      return activities.slice(0, this.nbActivitiesPerPage * this.pageNumber)
    },
    readActivitiesToDisplay () {
      if (this.unreadActivities.length >= this.nbActivitiesPerPage * this.pageNumber) {
        return []
      } else {
        // Return the remaining number of unread activities (the newest)
        return this.readActivities.slice(0, this.nbActivitiesPerPage * this.pageNumber - this.unreadActivities.length)
      }
    },
    lastReadNewsDate () {
      if (this.readActivities.length > 0) {
        return dayjs(this.readActivities[this.readActivities.length - 1].modificationDate, DATE_EXCHANGE_FORMAT)
      } else { // if no read news date, return the currentDate
        return undefined
      }
    },
    lastActivity () {
      // For infinite scroll
      // If only unread activities, this is the latest unread activity
      // Else this is the latest read activity
      const oldestRead = this.readActivitiesToDisplay.length > 0 ? this.readActivitiesToDisplay[this.readActivitiesToDisplay.length - 1] : undefined
      const oldestUnread = this.unreadActivities.length > 0 ? this.unreadActivities[this.unreadActivities.length - 1] : undefined
      if (oldestRead === undefined && oldestUnread !== undefined) {
        return oldestUnread
      } else {
        return oldestRead
      }
    }
  },
  created () {
    this.loadActivities()
    if (this.currentUser.isTeacher) {
      this.loadTeacherClasses()
    }
  },
  methods: {
    loadActivities (data) {
      this.isLoading = true
      getDashboard1DActivity(
        this.displayAll && this.lastReadNewsDate !== undefined ? this.lastReadNewsDate.format(DATE_EXCHANGE_FORMAT) : dayjs().format(DATE_EXCHANGE_FORMAT),
        this.nbActivitiesPerPage,
        this.isTeacher && data ? data.classId : 0,
        this.isParent ? data ? data.userId : this.currentUser.children[0].userId : 0
      ).then((data) => {
        this.isLoading = false
        this.isFirstLoad = false
        this.isAllLoaded = true
        if (data.success) {
          this.error = false
          this.pageNumber += 1
          this.lastDashboardAccessDate = data.lastDashboardAccessDate
          data.activities.forEach((activity) => {
            if (this.isUnread(activity)) {
              this.unreadActivities.push(activity)
            } else {
              this.readActivities.push(activity)
            }
          })
          // Sort both activities array by modificationDate
          this.readActivities.sort((a, b) => {
            return dayjs(b.modificationDate) - dayjs(a.modificationDate)
          })
          this.unreadActivities.sort((a, b) => {
            return dayjs(b.modificationDate) - dayjs(a.modificationDate)
          })
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    isUnread (activity) {
      return dayjs(activity.modificationDate, DATE_EXCHANGE_FORMAT).isAfter(dayjs(this.lastDashboardAccessDate, DATE_EXCHANGE_FORMAT))
    },
    loadTeacherClasses () {
      getUserCommunities(this.$store.state.user.userId, { label: '', isCommunityActive: false, isInstitutionalActive: false, isPedagogicalActive: false }).then(data => {
        if (data.success) {
          this.error = false
          this.findClassesInGroups(data.groups)
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    findClassesInGroups (groups) {
      groups.forEach((group, index) => {
        if (group.isClass) {
          this.teacherClasses.push({
            classId: group.groupId,
            className: group.groupName,
            index: index + 1
          })
        }
      })
      this.teacherClasses.sort((a, b) => a.index - b.index)
      console.log(this.teacherClasses)
    },
    handleScroll () {
      if (this.displayAll) {
        const scroll = this.$refs.scroll
        if (scroll.scrollTop > oldScrollTop) { // if we go down
          const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

          if (nbPixelsBeforeBottom <= 5) {
            if (!this.isLoading) {
              this.loadActivities()
            }
          }
        }
        oldScrollTop = scroll.scrollTop
      }
    },
    refresh (data = undefined) {
      this.readActivities = []
      this.unreadActivities = []
      this.loadActivities(data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
.activity-widget-1D{
  overflow: hidden;
  @extend %widget;
}

.activity-filter{
  margin-bottom: 20px;
}

.activities{
  height: calc(100% - 50px);
  overflow: auto;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.infinite-scroll {
  height: 100%;
}

.separator {
  font-size: 0.8rem;
  color: $color-new-light-text;
  border-bottom: 2px solid;
  text-align: right;
  margin: 10px 4px 8px 0;
}

.placeholder {
  @extend %content-placeholder;
}
</style>
