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
      activities: [],
      nbNewActivities: 0,
      lastDashboardAccessDate: undefined
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
          this.activities = data.activities
          this.nbNewActivities = data.nbNewActivities
          this.lastDashboardAccessDate = data.lastDashboardAccessDate
        } else {
          this.error = true
        }
      }, (err) => {
        this.error = true
        console.error(err)
      })
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
