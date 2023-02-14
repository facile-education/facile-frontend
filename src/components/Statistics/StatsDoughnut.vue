<template>
  <section>
    <h2 v-t="service" />
    <PentilaSpinner v-if="isLoading" />
    <div v-else-if="data !== undefined">
      <span>Total : {{ data.totalCount }}</span>
      <Chart
        :type="'doughnut'"
        :labels="data.labels"
        :datasets="data.datasets"
      />
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
  section {
    position: relative;
  }
</style>

<i18n locale="fr">
{
  "documents": "Documents",
  "homeworks": "Travail donné"
}
</i18n>
