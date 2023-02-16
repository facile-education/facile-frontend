<template>
  <section>
    <h2 v-t="service" />
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <PentilaSpinner />
    </div>
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
import { getFilesCount, getHomeworksCount } from '@/api/statistics.service'

export default {
  name: 'StatsDoughnut',
  components: { Chart },
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
      data: undefined
    }
  },
  computed: {
    nullPlaceholder () {
      if (this.service === 'documents') {
        return this.$t('documentsPlaceholder')
      } else if (this.service === 'homeworks') {
        return this.$t('homeworkPlaceholder')
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
            this.data = data
          } else {
            console.error('Error')
          }
        })
      } else if (this.service === 'homeworks') {
        this.isLoading = true
        getHomeworksCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
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
}
</script>

<style lang="scss" scoped>

.doughnut-chart, .null-placeholder, .loading-placeholder {
  height: 30vh;
  max-height: 350px;
}

.loading-placeholder {
  position: relative;
}

.null-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
}
</style>

<i18n locale="fr">
{
  "documents": "Documents",
  "homeworks": "Travail donné",
  "documentsPlaceholder": "Aucun document mis en ligne",
  "homeworkPlaceholder": "Aucun travail donné"
}
</i18n>
