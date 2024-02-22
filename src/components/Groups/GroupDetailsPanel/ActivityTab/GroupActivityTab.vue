<template>
  <div class="activity-tab">
    <WeprodeSpinner
      v-if="activitiesLoading"
      style="z-index: 100"
    />
    <p
      v-if="activityList.length === 0 && !activitiesLoading"
      v-t="('Groups.GroupActivityTab.noActivity')"
      class="placeholder"
    />
    <div
      v-else-if="activityList.length >= 1"
      ref="scroll"
      class="activities"
      @scroll="handleScroll"
    >
      <ul>
        <li
          v-for="activity in activityList"
          :key="activity.activityId"
        >
          <ActivityItem
            :activity="activity"
            :is-last="activity.activityId === lastActivity.activityId"
            :is-dashboard="false"
            @get-next-activities="getActivities"
            @refresh="refresh"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ActivityItem from '@components/Dashboard/ActivityWidget/ActivityItem.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import documentsService from '@/api/documents/documents.service'
import { getGroupActivity } from '@/api/groups.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { allActivitiesPaginationSize } from '@/constants/dashboardConstants'

let oldScrollTop = 0

export default {
  name: 'GroupActivityTab',
  components: { ActivityItem, WeprodeSpinner },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activitiesLoading: false,
      activityList: [],
      hasEnded: false
    }
  },
  computed: {
    sortedActivities () {
      let sortedActivities = this.activityList
      sortedActivities = sortedActivities.sort((a, b) => a.modificationDate - b.modificationDate)
      return sortedActivities
    },
    lastActivity () {
      // Last activity is the one with the oldest modificationDate
      return this.sortedActivities[this.activityList.length - 1]
    },
    lastActivityDate () {
      if (this.lastActivity) {
        return this.lastActivity.modificationDate
      } else {
        // If no activity, return '-1'
        return '-1'
      }
    }
  },
  watch: {
    group: {
      handler () {
        this.activityList.length = 0
        this.hasEnded = false
        this.getActivities()
      }
    }
  },
  created () {
    this.getActivities()
  },
  methods: {
    refresh () {
      this.activityList = []
      this.hasEnded = false
      this.getActivities()
    },
    getActivities () {
      if (this.group.isGroupRootFolder) {
        this.activitiesLoading = true
        documentsService.getDocumentGroupActivity(this.group.groupId, this.lastActivityDate, allActivitiesPaginationSize).then((data) => {
          this.activitiesLoading = false
          if (data.success) {
            if (data.activities.length < allActivitiesPaginationSize) {
              this.hasEnded = true
            }
            this.activityList = this.activityList.concat(data.activities)
          }
        })
      } else {
        this.activitiesLoading = true
        getGroupActivity(this.group.groupId, this.lastActivityDate, allActivitiesPaginationSize).then((data) => {
          this.activitiesLoading = false
          if (data.success) {
            if (data.activities.length < allActivitiesPaginationSize) {
              this.hasEnded = true
            }
            this.activityList = this.activityList.concat(data.activities)
            console.log('activities = ', this.activityList)
          }
        })
      }
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom <= 0) {
          if (!this.activitiesLoading && !this.hasEnded) {
            this.getActivities()
          }
        }
      }
      oldScrollTop = scroll.scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.activity-tab {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3px;

  .activities {
    flex: 1;
    overflow: auto;
    margin-bottom: 10px;;
  }
}

.placeholder {
  margin-top: 50px;
  text-align: center;
}

</style>
