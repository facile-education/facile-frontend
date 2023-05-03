<template>
  <div class="container">
    <div
      class="activity-item"
      :class="{'theme-border-color': activity.isNew}"
    >
      <div
        v-if="activity.isNew"
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
      />
      <HHCActivity
        v-else-if="isHHCActivity"
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

export default {
  name: 'ActivityItem',
  components: { HHCActivity, MembershipActivity, DocActivity, NewsActivity },
  props: {
    activity: {
      type: Object,
      required: true
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
      return this.activity.type === activityConstants.TYPE_ADD_MEMBERSHIP || this.activity.type === activityConstants.TYPE_REMOVE_MEMBERSHIP
    },
    isHHCActivity () {
      return this.activity.type === activityConstants.TYPE_PENDING_RENVOI || this.activity.type === activityConstants.TYPE_SCHOOL_RENVOI
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
