<template>
  <div class="activity-tab">
    <p
      v-if="activityList.length === 0"
      v-t="('noActivity')"
      class="placeholder"
    />
    <div
      v-else
      ref="scroll"
      class="activities"
      @scroll="handleScroll"
    >
      <PentilaSpinner v-if="activitiesLoading" />
      <GroupActivityItem
        v-for="(activity, index) in activityList"
        :key="index"
        :activity="activity"
      />
    </div>
  </div>
</template>

<script>
import { getGroupHistory, getSpecificGroupActivities } from '@/api/groups.service'
import { nbActivityPerPage } from '@/constants/activityConstants'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const GroupActivityItem = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/ActivityTab/GroupActivityItem'))
let oldScrollTop = 0

export default {
  name: 'GroupActivityTab',
  components: { GroupActivityItem },
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
      maxDate: undefined
    }
  },
  watch: {
    group: {
      handler () {
        this.activityList.length = 0
        this.maxDate = dayjs().add(1, 'day')
        this.getActivities()
      }
    }
  },
  created () {
    this.maxDate = dayjs().add(1, 'day')
    this.getActivities()
  },
  methods: {
    getActivities () {
      if (this.group.isGroupRootFolder) {
        this.getGroupDocumentHistory()
      } else {
        this.getGroupHistory()
      }
    },
    getGroupDocumentHistory () {
      this.activitiesLoading = true
      getSpecificGroupActivities(this.group.groupId, this.maxDate.format('YYYY-MM-DD'), nbActivityPerPage, true, false, true, false, false, false, false, false).then((data) => {
        this.activitiesLoading = false
        if (data.success) {
          this.activityList = this.activityList.concat(data.activities)
          // Update maxDate
          if (this.activityList.length > 1) {
            this.maxDate = dayjs(this.activityList[this.activityList.length - 1].modificationDate) // /!\ Assume the returned list is already sorted by date
          }
        }
      })
    },
    getGroupHistory () {
      this.activitiesLoading = true
      getGroupHistory(this.group.groupId, this.maxDate.format('YYYY-MM-DD'), nbActivityPerPage).then((data) => {
        this.activitiesLoading = false
        if (data.success) {
          this.activityList = this.activityList.concat(data.activities)
          // Update maxDate
          if (this.activityList.length > 1) {
            this.maxDate = dayjs(this.activityList[this.activityList.length - 1].modificationDate) // /!\ Assume the returned list is already sorted by date
          }
        }
      })
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom <= 0) {
          if (!this.activitiesLoading) {
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

.activity-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3px;

  .activities {
    position: relative;
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
