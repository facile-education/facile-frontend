<template>
  <section>
    <header>
      <h2 v-t="'Statistics.VisitsChart.globalVisits'" />
    </header>
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <WeprodeSpinner />
    </div>
    <div
      v-else-if="error === true"
      v-t="'Statistics.VisitsChart.error'"
      class="error-placeholder"
    />
    <div v-else-if="data !== undefined">
      <Chart
        v-if="data.labels"
        class="stat-chart"
        :labels="data.labels"
        :datasets="data.datasets"
        :fill="comparator === ''"
      />
    </div>
  </section>
</template>

<script>
import WeprodeUtils from '@utils/weprode.utils'

import { getStatServices } from '@/api/applicationManager.service'
import { getSessionsCount } from '@/api/statistics.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import Chart from '@/components/Statistics/Chart.vue'

export default {
  name: 'VisitsChart',
  components: { Chart, WeprodeSpinner },
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
      error: false,
      defaultService: { applicationId: -1, name: this.$t('Statistics.VisitsChart.allServices') },
      selectedService: undefined,
      services: []
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
      this.selectedService = this.defaultService
      this.getData()
    }
  },
  created () {
    this.selectedService = this.defaultService
    this.getServices()
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
    },
    getServices () {
      getStatServices(this.selectedSchool.schoolId).then(
        (data) => {
          if (data.success) {
            data.services.forEach(element => {
              element.name = this.$t('Menu.' + element.name)
            })

            this.services = [this.defaultService, ...WeprodeUtils.sortArrayWithString(data.services, false, 'name')]
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
    },
    onServiceSelect () {
      this.getData()
    }
  }
}
</script>

<style>
/* TODO fix alignement issue within dropdown component */
.services .base-autocomplete {
  right: 0;
}
</style>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
}

h2 {
  font-weight: normal;
}

.services {
  margin-left: auto;
}

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
