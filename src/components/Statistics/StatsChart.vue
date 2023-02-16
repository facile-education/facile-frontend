<template>
  <section>
    <h2 v-t="comparator === '' ? 'globalUses' : 'profileUses'" />
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <PentilaSpinner />
    </div>
    <div v-else-if="data !== undefined">
      <Chart
        v-if="data.labels"
        class="stat-chart"
        :labels="data.labels"
        :datasets="data.datasets"
      />
    </div>
  </section>
</template>

<script>
import { getSessionsCount } from '@/api/statistics.service'
import Chart from '@/components/Statistics/Chart.vue'

export default {
  name: 'StatsChart',
  components: { Chart },
  props: {
    startTime: {
      type: Object,
      required: true
    },
    endTime: {
      type: Object,
      required: true
    },
    selectedSchool: {
      type: Object,
      required: true
    },
    comparator: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isLoading: false,
      data: undefined
    }
  },
  watch: {
    startTime () {
      this.getData()
    },
    endTime () {
      this.getData()
    },
    selectedSchool () {
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.isLoading = true
      getSessionsCount(this.selectedSchool.schoolId, this.startTime, this.endTime, this.comparator).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.data = data
        } else {
          console.error('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-placeholder {
  position: relative;
  height: 40vh;
  max-height: 442px;
}

.stat-chart {
  height: 40vh;
  max-height: 442px;
}
</style>

<i18n locale="fr">
{
  "globalUses": "Fréquentation globale",
  "profileUses": "Fréquentation par profil"
}
</i18n>
