<template>
  <div class="activity-tab">
    <div class="header">
      <img
        src="@/assets/icon_commu-black.svg"
        alt="icon_commu"
      >
      <span v-t="'activity-feed'" />
    </div>

    <div
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
import { getGroupActivity } from '@/api/groups.service'
import { nbActivityPerPage } from '@/constants/activityConstants'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
const GroupActivityItem = defineAsyncComponent(() => import('@components/Groups/GroupActivityItem'))
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
        this.activityList = []
        this.getActivities()
      }
    }
  },
  created () {
    this.maxDate = dayjs()
    this.getActivities()
  },
  methods: {
    getActivities () {
      this.activitiesLoading = true
      getGroupActivity(this.group.groupId, this.maxDate.format('YYYY-MM-DD'), nbActivityPerPage).then((data) => {
        this.activitiesLoading = false
        if (data.success) {
          this.activityList = this.activityList.concat(data.activities)
          // Update maxDate
          this.maxDate = dayjs(this.activityList[this.activityList.length - 1].modificationDate) // /!\ Assume the returned list is already sorted by date
        }
      })
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom === 0) {
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
  padding: 0 20px;

  .header {
    display: flex;
    align-items: center;
    font-weight: 600;
    border-bottom: 1px solid $color-border;

    img {
      margin-right: 10px;
    }
  }

  .activities {
    position: relative;
    overflow: auto;
    flex: 1;
  }
}

</style>

<i18n locale="fr">
{
  "activity-feed": "Fil d'activité"
}
</i18n>
