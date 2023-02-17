<template>
  <section>
    <h2 v-t="comparator === '' ? 'globalUses' : 'profileUses'" />
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <PentilaSpinner />
    </div>
    <div
      v-else-if="error === true"
      v-t="'error'"
      class="error-placeholder"
    />
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
      data: undefined,
      error: false
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
          this.error = false
          this.data = data
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
.loading-placeholder, .error-placeholder {
  position: relative;
  height: 40vh;
  max-height: 442px;
}

.error-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25em;
  background-color: #F4F8FF;
}

.stat-chart {
  height: 40vh;
  max-height: 442px;
}
</style>

<i18n locale="fr">
{
  "globalUses": "Fréquentation globale",
  "error": "Oups, une erreur est survenue...",
  "profileUses": "Fréquentation par profil"
}
</i18n>
