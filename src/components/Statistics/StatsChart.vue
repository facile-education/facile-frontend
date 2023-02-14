<template>
  <section>
    <h2 v-t="comparator === '' ? 'globalUses' : 'profileUses'" />
    <PentilaSpinner v-if="isLoading" />
    <div v-else-if="data !== undefined">
      <Chart
        v-if="data.labels"
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
section {
  position: relative;
}
</style>

<i18n locale="fr">
{
  "globalUses": "Fréquentation globale",
  "profileUses": "Fréquentation par profils"
}
</i18n>
