<template>
  <section :class="{'full-page': displayAll}">
    <ActivityHeader
      :nb-new-activities="nbNewActivities"
      :display-all="displayAll"
    />

    <ActivityFilter
      :initial-filter="filter"
      @updateFilter="updateFilter"
    />

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
    <div
      v-else
      ref="scroll"
      class="activities"
      :class="{'infinite-scroll' : displayAll}"
    >
      <ul v-if="unreadActivities.length !== 0">
        <li
          v-for="activity in unreadActivities"
          :key="activity.activityId"
        >
          <ActivityItem
            :activity="activity"
            :is-unread="true"
            :is-last="activity.activityId === lastActivity.activityId"
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
            :is-last="activity.activityId === lastActivity.activityId"
            @refresh="refresh"
          />
        </li>
      </ul>

      <div
        v-if="!displayAll"
        class="footer"
      >
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
import ActivityFilter from '@components/Dashboard/ActivityWidget/ActivityFilter.vue'

export default {
  name: 'ActivityWidget',
  components: { ActivityFilter, ActivityItem, ActivityHeader },
  props: {
    displayAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      error: false,
      filter: {
        activityTypes: [],
        selectedGroup: undefined
      },
      nbNewActivities: 0,
      lastDashboardAccessDate: undefined,
      readActivities: [],
      unreadActivities: []
    }
  },
  computed: {
    separatorLabel () {
      return this.$t('newsSince') + dayjs(this.lastDashboardAccessDate, 'YYYY-MM-DD HH:mm').format('DD MMMM YYYY')
    },
    filterBooleans () {
      if (this.filter.activityTypes.length === 0) { // If no filter selected, return all activity types
        return {
          withNews: true,
          withDocs: true,
          withSchoolLife: true,
          withMemberShip: true,
          withSession: true
        }
      } else { // else, return only the selected types
        return {
          withNews: this.filter.activityTypes.includes('news'),
          withDocs: this.filter.activityTypes.includes('docs'),
          withSchoolLife: this.filter.activityTypes.includes('schoolLife'),
          withMemberShip: this.filter.activityTypes.includes('membership'),
          withSession: this.filter.activityTypes.includes('sessions')
        }
      }
    },
    lastActivity () {
      // Return the last activity between read Activities and unRead Activities, assume each of them are sorted by date in their respective array
      const oldestRead = this.readActivities.length > 0 ? this.readActivities[this.readActivities.length - 1] : undefined
      const oldestUnread = this.unreadActivities.length > 0 ? this.unreadActivities[this.unreadActivities.length - 1] : undefined

      return oldestRead !== undefined && oldestUnread !== undefined && dayjs(oldestUnread.modificationDate, 'YYYY-MM-DD HH:mm').isBefore(dayjs(oldestRead.modificationDate, 'YYYY-MM-DD HH:mm'))
        ? oldestUnread
        : oldestRead !== undefined
          ? oldestRead
          : oldestUnread
    },
    lastActivityDate () {
      if (this.lastActivity) {
        return this.lastActivity.modificationDate
      } else { // if no activity, return the currentDate
        return dayjs()
      }
    }
  },
  created () {
    this.getActivities()
  },
  methods: {
    updateFilter (filter) {
      this.filter = filter
      this.refresh()
    },
    refresh () {
      this.readActivities = []
      this.unreadActivities = []
      this.getActivities()
    },
    getActivities () {
      this.isLoading = true
      getDashboardActivity( // TODO call with memberShip boolean and groupId
        this.displayAll ? this.lastActivityDate.format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        this.displayAll ? activityConstants.nbActivityPerPage : activityConstants.nbActivityInWidget,
        this.filterBooleans.withNews,
        this.filterBooleans.withDocs,
        this.filterBooleans.withSchoolLife,
        this.filterBooleans.withSession
      ).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.nbNewActivities = data.nbNewActivities
          this.lastDashboardAccessDate = data.lastDashboardAccessDate
          // this.lastDashboardAccessDate = '2022-05-05 10:19:48'

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

  &.full-page {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
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

.infinite-scroll {
  flex: 1;
  overflow: auto;
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
