<template>
  <section
    data-test="statistics-widget"
  >
    <StatisticsHeader />
    <WeprodeSpinner
      v-if="isLoading"
      style="z-index: 1"
    />
    <div
      v-if="error === true"
      v-t="'Dashboard.StatisticsWidget.errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="statistics.length === 0 && !isFirstLoad"
      v-t="'Dashboard.StatisticsWidget.emptyPlaceholder'"
      class="placeholder"
    />
    <div v-else>
      <div
        v-t="'Dashboard.StatisticsWidget.lastWeek'"
        class="period"
      />
      <ul @click="redirect">
        <li
          v-for="statistic in statistics"
          :key="statistic.label"
        >
          <StatisticItem :statistic="statistic" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import StatisticItem from '@components/Dashboard/StatisticsWidget/StatisticItem.vue'
import StatisticsHeader from '@components/Dashboard/StatisticsWidget/StatisticsHeader.vue'

import { getDashboardStatistics } from '@/api/statistics.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { STATISTICS } from '@/constants/appConstants'

export default {
  name: 'StatisticsWidget',
  components: { StatisticItem, StatisticsHeader, WeprodeSpinner },
  data () {
    return {
      isLoading: false,
      isFirstLoad: true,
      error: false,
      statistics: []
    }
  },
  created () {
    this.getSchoolStatistics()
  },
  methods: {
    getSchoolStatistics () {
      this.isLoading = true
      getDashboardStatistics().then((data) => {
        this.isFirstLoad = false
        this.isLoading = false
        if (data.success) {
          this.error = false
          const nbUsers = {
            label: this.$t('Dashboard.StatisticsWidget.nbUsers'),
            current: data.activeUsersCount,
            previous: data.previousActiveUsersCount,
            type: 1
          }
          const nbConnexions = {
            label: this.$t('Dashboard.StatisticsWidget.nbConnexions'),
            current: data.nbConnexions,
            previous: data.previousNbConnexions,
            type: 2
          }
          const nbActivities = {
            label: this.$t('Dashboard.StatisticsWidget.nbActivities'),
            current: data.nbActivities,
            previous: data.nbPreviousActivities,
            type: 3
          }
          this.statistics.push(nbUsers)
          this.statistics.push(nbConnexions)
          this.statistics.push(nbActivities)
        } else {
          this.error = true
          console.error('Error when getting dashboard statistics')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    redirect () {
      this.$router.push({ name: STATISTICS })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

section {
  min-width: min($statistics-widget-min-width, 100%);
  width: 100%;
  //max-width: $statistics-widget-max-width;
  position: relative;
  @extend %widget;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  cursor: pointer;

  li {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.placeholder {
  @extend %content-placeholder;
}

.period {
  font-size: 0.8rem;
}
</style>
