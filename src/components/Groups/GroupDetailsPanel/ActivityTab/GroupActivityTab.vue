<template>
  <div class="activity-tab">
    <WeprodeSpinner
      v-if="activitiesLoading"
      style="z-index: 100"
    />
    <p
      v-else-if="activityList.length === 0"
      v-t="('noActivity')"
      class="placeholder"
    />
    <div
      v-else
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
      hasEnded: true
    }
  },
  computed: {
    lastActivity () {
      return this.activityList[this.activityList.length - 1]
    },
    lastActivityDate () {
      if (this.lastActivity) {
        return dayjs(this.lastActivity.publicationDate, 'YYYY-MM-DD HH:mm:sss')
      } else { // if no activity, return the currentDate
        return dayjs()
      }
    }
  },
  watch: {
    group: {
      handler () {
        this.activityList.length = 0
        this.maxDate = dayjs().add(1, 'day')
        this.hasEnded = false
        this.getActivities()
      }
    }
  },
  created () {
    this.maxDate = dayjs().add(1, 'day')
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
        documentsService.getDocumentGroupActivity(this.group.groupId, this.lastActivityDate.format('YYYY-MM-DD HH:mm:sss'), allActivitiesPaginationSize).then((data) => {
          this.activitiesLoading = false
          if (data.success) {
            this.activityList = this.activityList.concat(data.activities)
            // Update maxDate
            if (this.activityList.length > 1) {
              this.maxDate = dayjs(this.activityList[this.activityList.length - 1].modificationDate) // /!\ Assume the returned list is already sorted by date
            }
          }
        })
      } else {
        this.activitiesLoading = true
        getGroupActivity(this.group.groupId, this.lastActivityDate.format('YYYY-MM-DD HH:mm:sss'), allActivitiesPaginationSize).then((data) => {
          this.activitiesLoading = false
          if (data.success) {
            if (data.activities.length < allActivitiesPaginationSize) {
              this.hasEnded = true
            }

            this.activityList = this.activityList.concat(data.activities)
            // Update maxDate
            if (this.activityList.length > 1) {
              this.maxDate = dayjs(this.activityList[this.activityList.length - 1].modificationDate) // /!\ Assume the returned list is already sorted by date
            }
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
    overflow: auto;
    flex: 1;
  }
}

.placeholder {
  margin-top: 50px;
  text-align: center;
}

</style>

<i18n locale="fr">
{
  "activity-feed": "Fil d'activité",
  "noActivity": "Aucune activité dans ce groupe"
}
</i18n>
