<template>
  <div class="container">
    <div
      class="activity-item"
      :class="{'theme-border-color': isUnread && !isConsulted}"
    >
      <div
        v-if="isUnread && !isConsulted"
        class="pellet theme-background-color"
      />
      <NewsActivity
        v-if="isNewsActivity"
        :news="activity"
        @updateNews="$emit('refresh')"
        @deleteNews="$emit('refresh')"
        @displayDetails="isConsulted=true"
      />
      <DocActivity
        v-else-if="isDocActivity"
        :activity="activity"
      />
      <MembershipActivity
        v-else-if="isMembershipActivity"
        :activity="activity"
        @refresh="$emit('refresh')"
      />
      <HHCActivity
        v-else-if="isHHCActivity"
        :activity="activity"
      />
      <SessionActivity
        v-else-if="isCourseActivity"
        :activity="activity"
      />
      <div v-else>
        Unrecognized activity type!
      </div>
    </div>
  </div>
</template>

<script>
import activityConstants from '@/constants/activityConstants'
import { defineAsyncComponent } from 'vue'
import { isInViewport } from '@utils/commons.util'
const NewsActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/NewsActivity.vue'))
const DocActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/DocActivity.vue'))
const MembershipActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/MembershipActivity.vue'))
const HHCActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/HHCActivity.vue'))
const SessionActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/SessionActivity.vue'))

export default {
  name: 'ActivityItem',
  components: { SessionActivity, HHCActivity, MembershipActivity, DocActivity, NewsActivity },
  props: {
    activity: {
      type: Object,
      required: true
    },
    isUnread: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['getNextActivities', 'refresh'],
  data () {
    return {
      isConsulted: false
    }
  },
  computed: {
    isNewsActivity () {
      return this.activity.type === activityConstants.TYPE_NEWS
    },
    isDocActivity () {
      return this.activity.type === activityConstants.TYPE_FILE_CREATION ||
        this.activity.type === activityConstants.TYPE_FILE_MODIFICATION ||
        this.activity.type === activityConstants.TYPE_FILE_MOVE ||
        this.activity.type === activityConstants.TYPE_FILE_DELETION ||
        this.activity.type === activityConstants.TYPE_FOLDER_CREATION ||
        this.activity.type === activityConstants.TYPE_FOLDER_MODIFICATION ||
        this.activity.type === activityConstants.TYPE_FOLDER_MOVE ||
        this.activity.type === activityConstants.TYPE_FOLDER_DELETION
    },
    isMembershipActivity () {
      return this.activity.type === activityConstants.TYPE_ADD_MEMBERSHIP ||
        this.activity.type === activityConstants.TYPE_REMOVE_MEMBERSHIP ||
        this.activity.type === activityConstants.TYPE_EXPIRED_GROUP
    },
    isHHCActivity () {
      return this.activity.type === activityConstants.TYPE_PENDING_RENVOI || this.activity.type === activityConstants.TYPE_SCHOOL_RENVOI
    },
    isCourseActivity () {
      return this.activity.type === activityConstants.TYPE_SESSION || this.activity.type === activityConstants.TYPE_HOMEWORK
    },
    isSessionActivity () {
      return this.activity.type === activityConstants.TYPE_HOMEWORK || this.activity.type === activityConstants.TYPE_SESSION
    }
  },
  mounted () {
    if (this.isLast && this.$refs.item !== undefined) {
      if (isInViewport(this.$refs.item)) {
        this.$emit('getNextActivities')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.container {
  padding-right: 4px;
  padding-top: 4px;
  height: $activity-item-height;
}

.activity-item {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  border: 1px solid $color-border;
}

.pellet {
  @extend %item-pellet;
}

</style>
