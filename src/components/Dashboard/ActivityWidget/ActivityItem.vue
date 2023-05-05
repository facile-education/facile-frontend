<template>
  <div class="container">
    <div
      class="activity-item"
      :class="{'theme-border-color': isUnread}"
    >
      <div
        v-if="isUnread"
        class="pellet theme-background-color"
      />
      <NewsActivity
        v-if="isNewsActivity"
        :news="activity"
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
      <CourseActivity
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
import NewsActivity from '@components/Dashboard/ActivityWidget/ActivityTypes/NewsActivity.vue'
import DocActivity from '@components/Dashboard/ActivityWidget/ActivityTypes/DocActivity.vue'
import MembershipActivity from '@components/Dashboard/ActivityWidget/ActivityTypes/MembershipActivity.vue'
import HHCActivity from '@components/Dashboard/ActivityWidget/ActivityTypes/HHCActivity.vue'
import CourseActivity from '@components/Dashboard/ActivityWidget/ActivityTypes/CourseActivity.vue'

export default {
  name: 'ActivityItem',
  components: { CourseActivity, HHCActivity, MembershipActivity, DocActivity, NewsActivity },
  props: {
    activity: {
      type: Object,
      required: true
    },
    isUnread: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh'],
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
