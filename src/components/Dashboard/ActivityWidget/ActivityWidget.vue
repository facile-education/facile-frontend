<template>
  <section>
    <ActivityHeader :nb-new-activities="nbNewActivities" />

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
      v-else-if="readActivities.length === 0 && unreadActivities.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <ul v-if="unreadActivities.length !== 0">
        <li
          v-for="activity in unreadActivities"
          :key="activity.activityId"
        >
          <ActivityItem
            :activity="activity"
            :is-unread="true"
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

      <ul v-if="readActivities.length !== 0">
        <li
          v-for="activity in readActivities"
          :key="activity.activityId"
        >
          <ActivityItem
            :activity="activity"
            @refresh="refresh"
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
import activityConstants from '@/constants/activityConstants'
import dayjs from 'dayjs'
import ActivityHeader from '@components/Dashboard/ActivityWidget/ActivityHeader.vue'
import { getDashboardActivity } from '@/api/dashboard.service'
import ActivityItem from '@components/Dashboard/ActivityWidget/ActivityItem.vue'

export default {
  name: 'ActivityWidget',
  components: { ActivityItem, ActivityHeader },
  data () {
    return {
      isLoading: false,
      error: false,
      nbNewActivities: 0,
      lastDashboardAccessDate: undefined,
      readActivities: [],
      unreadActivities: []
    }
  },
  computed: {
    separatorLabel () {
      return this.$t('newsSince') + dayjs(this.lastDashboardAccessDate, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY')
    }
  },
  created () {
    this.getActivities()
  },
  methods: {
    refresh () {
      this.getActivities()
    },
    getActivities () {
      this.isLoading = true
      getDashboardActivity(dayjs().format('YYYY-MM-DD HH:mm:ss'), activityConstants.nbActivityPerPage, true, true, true, true).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.nbNewActivities = data.nbNewActivities
          this.lastDashboardAccessDate = data.lastDashboardAccessDate
          // this.lastDashboardAccessDate = '2022-05-05 10:19:48'
          this.readActivities = []
          this.unreadActivities = []
          data.activities.forEach((activity) => {
            if (this.isUnread(activity)) {
              this.unreadActivities.push(activity)
            } else {
              this.readActivities.push(activity)
            }
          })
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
    },
    isUnread (activity) {
      return dayjs(activity.modificationDate, 'YYYY-MM-DD HH:mm').isAfter(dayjs(this.lastDashboardAccessDate, 'YYYY-MM-DD HH:mm'))
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
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.separator {
  font-size: 0.8rem;
  color: $color-new-light-text;
  border-bottom: 2px solid;
  text-align: right;
  margin: 10px 4px 8px 0;
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
  "newsSince": "Nouveautés depuis le ",
  "showMore": "Voir toutes les activités"
}
</i18n>
