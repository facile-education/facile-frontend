<template>
  <div class="container">
    <div
      class="activity-item"
      :class="{'theme-border-color': !isActivityRead, 'is-unread': !isActivityRead, 'theme-hover-border-color': isNewsActivity || isHHCActivity || isSessionActivity}"
      data-test="activity-item"
    >
      <div
        v-if="!isActivityRead"
        class="pellet theme-background-color"
      />

      <NewsActivity
        v-if="isNewsActivity"
        :news="activity"
        @mark-as-read="$emit('markAsRead')"
        @update-news="$emit('refresh')"
        @delete-news="$emit('refresh')"
      />
      <DocActivity
        v-else-if="isDocActivity"
        :is-dashboard="isDashboard"
        :activity="activity"
      />
      <MembershipActivity
        v-else-if="isMembershipActivity"
        :activity="activity"
        :is-dashboard="isDashboard"
        @refresh="$emit('refresh')"
      />
      <HHCActivity
        v-else-if="isHHCActivity"
        :activity="activity"
      />
      <SessionActivity
        v-else-if="isCourseActivity"
        :activity="activity"
        :is-dashboard="isDashboard"
      />
      <ExpiredGroupActivity
        v-else-if="isExpiredGroupActivity"
        :activity="activity"
        @refresh="$emit('refresh')"
      />
      <div v-else>
        {{ $t('Dashboard.ActivityItem.unknown-activity') }}
      </div>
    </div>
  </div>
</template>

<script>
import { isInViewport } from '@utils/commons.util'
import { defineAsyncComponent } from 'vue'

import activityConstants from '@/constants/activityConstants'
const NewsActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/NewsActivity.vue'))
const DocActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/DocActivity.vue'))
const MembershipActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/MembershipActivity.vue'))
const HHCActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/HHCActivity.vue'))
const SessionActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/SessionActivity.vue'))
const ExpiredGroupActivity = defineAsyncComponent(() => import('@components/Dashboard/ActivityWidget/ActivityTypes/ExpiredGroupActivity.vue'))

export default {
  name: 'ActivityItem',
  components: { SessionActivity, HHCActivity, MembershipActivity, DocActivity, NewsActivity, ExpiredGroupActivity },
  props: {
    activity: {
      type: Object,
      required: true
    },
    isUnread: {
      type: Boolean,
      default: false
    },
    isDashboard: {
      type: Boolean,
      default: true
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['getNextActivities', 'refresh', 'markAsRead'],
  computed: {
    isActivityRead () {
      return this.activity.type !== activityConstants.TYPE_NEWS || this.activity.hasRead
    },
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
        this.activity.type === activityConstants.TYPE_REMOVE_MEMBERSHIP
    },
    isHHCActivity () {
      return this.activity.type === activityConstants.TYPE_PENDING_RENVOI || this.activity.type === activityConstants.TYPE_SCHOOL_RENVOI
    },
    isCourseActivity () {
      return this.activity.type === activityConstants.TYPE_SESSION || this.activity.type === activityConstants.TYPE_HOMEWORK
    },
    isSessionActivity () {
      return this.activity.type === activityConstants.TYPE_HOMEWORK || this.activity.type === activityConstants.TYPE_SESSION
    },
    isExpiredGroupActivity () {
      return this.activity.type === activityConstants.TYPE_EXPIRED_GROUP
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

.is-unread {
  border: 2px solid $color-border;
}
.pellet {
  @extend %item-pellet;
}

</style>
