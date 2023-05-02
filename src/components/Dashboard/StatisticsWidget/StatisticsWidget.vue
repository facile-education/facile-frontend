<template>
  <section @click="$router.push({name: 'Statistics'})">
    <StatisticsHeader />
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
      v-else-if="statistics.length === 0 "
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul v-else>
      <li
        v-for="statistic in statistics"
        :key="statistic.label"
      >
        <StatisticItem :statistic="statistic" />
      </li>
    </ul>
  </section>
</template>

<script>
import StatisticsHeader from '@components/Dashboard/StatisticsWidget/StatisticsHeader.vue'
import { getDashboardStatistics } from '@/api/statistics.service'
import StatisticItem from '@components/Dashboard/StatisticsWidget/StatisticItem.vue'

export default {
  name: 'StatisticsWidget',
  components: { StatisticItem, StatisticsHeader },
  data () {
    return {
      isLoading: false,
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
        this.isLoading = false
        if (data.success) {
          this.error = false
          const nbUsers = {
            label: this.$tc('nbUsers', data.activeUsersCount),
            current: data.activeUsersCount,
            previous: data.previousActiveUsersCount
          }
          const nbConnexions = {
            label: this.$tc('nbConnexions', data.nbConnexions),
            current: data.nbConnexions,
            previous: data.previousNbConnexions
          }
          const nbActivities = {
            label: this.$tc('nbActivities', data.groupNewsCount),
            current: data.groupNewsCount,
            previous: data.previousGroupNewsCount
          }
          this.statistics.push(nbUsers)
          this.statistics.push(nbConnexions)
          this.statistics.push(nbActivities)
        } else {
          this.error = true
          console.error('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

section {
  min-width: min($statistics-widget-min-width, 100%);
  width: 100%;
  max-width: $statistics-widget-max-width;
  position: relative;
  cursor: pointer;
  @extend %widget;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.placeholder {
  height: 106px;
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucune statistique à afficher",
  "nbActivities": "Activité | Activité | Activités",
  "nbConnexions": "Session | Session | Sessions",
  "nbUsers": "Visiteur unique | Visiteur unique | Visiteurs uniques"
}
</i18n>
