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
      v-else-if="data.datasets === undefined || data.datasets.length === 0 "
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <ul v-else>
      <li
        v-for="statistic in data.datasets"
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
      data: {
        datasets: undefined,
        labels: undefined
      }
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
          this.data.datasets = data.datasets
          this.data.labels = data.labels
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
  "emptyPlaceholder": "Aucune statistique à afficher"
}
</i18n>
