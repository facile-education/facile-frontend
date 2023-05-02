<template>
  <section>
    <ActivityHeader />

    <PentilaSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="activities.length === 0 "
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <ul>
        <li
          v-for="activity in activities"
          :key="activity.activityId"
        >
          <News
            v-if="isNewsActivity(activity)"
            :news="activity"
          />
          <DocActivity
            v-else-if="isDocActivity(activity)"
            :activity="activity"
          />
          <MembershipActivity
            v-else-if="isMembershipActivity(activity)"
            :activity="activity"
          />
          <RenvoiActivity
            v-else
            :activity="activity"
          />
        </li>
      </ul>
      <div class="footer">
        <button
          v-t="'showMore'"
          class="show-more"
          @click="$router.push({ name: 'AllActivities' })"
        />
      </div>
    </div>
  </section>
</template>

<script>
import News from '@components/Dashboard/News/News'
import DocActivity from '@components/Dashboard/ActivityWidget/DocActivity'
import MembershipActivity from '@components/Dashboard/ActivityWidget/MembershipActivity'
import RenvoiActivity from '@components/Dashboard/ActivityWidget/RenvoiActivity'
import activityConstants from '@/constants/activityConstants'
import dayjs from 'dayjs'
import ActivityHeader from '@components/Dashboard/ActivityWidget/ActivityHeader.vue'
import { getDashboardActivity } from '@/api/dashboard.service'

export default {
  name: 'ActivityWidget',
  components: { ActivityHeader, RenvoiActivity, MembershipActivity, DocActivity, News },
  data () {
    return {
      isLoading: false,
      error: false,
      activities: []
    }
  },
  created () {
    this.getActivities()
  },
  methods: {
    getActivities () {
      this.isLoading = true
      getDashboardActivity(dayjs().format('YYYY-MM-DD HH:mm'), activityConstants.nbActivityPerPage, true, true, true, true).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.activities = data.activities
          // TODO: this.nbUnread = data.nbUnread
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    isNewsActivity (activity) {
      return activity.type === activityConstants.TYPE_NEWS
    },
    isDocActivity (activity) {
      return activity.type === activityConstants.TYPE_FILE_CREATION ||
      activity.type === activityConstants.TYPE_FILE_MODIFICATION ||
      activity.type === activityConstants.TYPE_FILE_MOVE ||
      activity.type === activityConstants.TYPE_FILE_DELETION ||
      activity.type === activityConstants.TYPE_FOLDER_CREATION ||
      activity.type === activityConstants.TYPE_FOLDER_MODIFICATION ||
      activity.type === activityConstants.TYPE_FOLDER_MOVE ||
      activity.type === activityConstants.TYPE_FOLDER_DELETION
    },
    isMembershipActivity (activity) {
      return activity.type === activityConstants.TYPE_ADD_MEMBERSHIP || activity.type === activityConstants.TYPE_REMOVE_MEMBERSHIP
    },
    isHHCActivity (activity) {
      return activity.type === activityConstants.TYPE_PENDING_RENVOI || activity.type === activityConstants.TYPE_SCHOOL_RENVOI
    },
    isSessionActivity (activity) {
      return activity.type === activityConstants.TYPE_HOMEWORK || activity.type === activityConstants.TYPE_SESSION
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  min-width: min($activity-widget-min-width, 100%);
  width: 100%;
  position: relative;
  @extend %widget;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.placeholder {
  height: 106px;
}

.footer {
  @extend %widget-footer;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucune activité à afficher",
  "showMore": "Voir toutes les activités"
}
</i18n>
