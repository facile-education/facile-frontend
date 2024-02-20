<template>
  <section>
    <h2 v-t="service" />
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <WeprodeSpinner />
    </div>
    <div
      v-else-if="error === true"
      v-t="'Statistics.StatsDoughnut.error'"
      class="error-placeholder"
    />
    <div v-else-if="data !== undefined">
      <Chart
        v-if="data.totalCount > 0"
        :type="'doughnut'"
        class="doughnut-chart"
        :labels="data.labels"
        :datasets="data.datasets"
        :centered-text="data.totalCount"
      />
      <div
        v-else
        class="null-placeholder"
      >
        {{ nullPlaceholder }}
      </div>
    </div>
  </section>
</template>

<script>
import Chart from '@components/Statistics/Chart.vue'

import { getFilesCount, getHomeworksCount, getSchoolLifeStudentsCount } from '@/api/statistics.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'StatsDoughnut',
  components: { Chart, WeprodeSpinner },
  props: {
    service: {
      type: String,
      required: true
    },
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
    }
  },
  data () {
    return {
      isLoading: false,
      data: undefined,
      error: false
    }
  },
  computed: {
    nullPlaceholder () {
      if (this.service === 'documents') {
        return this.$t('Statistics.StatsDoughnut.documentsPlaceholder')
      } else if (this.service === 'homeworks') {
        return this.$t('Statistics.StatsDoughnut.homeworkPlaceholder')
      } else if (this.service === 'schoolLife') {
        return this.$t('Statistics.StatsDoughnut.schoolLifePlaceholder')
      } else {
        return '0'
      }
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
      if (this.service === 'documents') {
        this.isLoading = true
        getFilesCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.error = false
            this.data = data
            this.translateLabels()
          } else {
            this.error = true
            console.error('Error', data)
          }
        })
      } else if (this.service === 'homeworks') {
        this.isLoading = true
        getHomeworksCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.error = false
            this.data = data
            this.translateLabels()
          } else {
            this.error = true
            console.error('Error', data)
          }
        })
      } else if (this.service === 'schoolLife') {
        this.isLoading = true
        getSchoolLifeStudentsCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.error = false
            this.data = data
            this.translateLabels()
          } else {
            this.error = true
            console.error('Error', data)
          }
        })
      }
    },
    translateLabels () {
      if (this.data !== undefined && this.data.labels !== undefined) {
        for (let index = 0; index < this.data.labels.length; ++index) {
          this.data.labels[index] = this.$t(this.data.labels[index].toString())
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-weight: normal;
  margin-top: 2em;
}

.doughnut-chart, .null-placeholder, .loading-placeholder, .error-placeholder {
  height: 37vh;
  max-height: 37vh;
  background-color: #F4F8FF;
}

.loading-placeholder {
  position: relative;
}

.null-placeholder, .error-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}
.null-placeholder {
  font-size: 2em;
}

.error-placeholder {
  font-size: 1.25em;
}
</style>
