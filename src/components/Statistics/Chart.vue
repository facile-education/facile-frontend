<template>
  <canvas ref="chart" />
</template>

<script>
import { Chart, registerables } from 'chart.js'

export default {
  name: 'Chart',
  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'line'
    }
  },
  data () {
    return {
      data: {
        labels: [],
        datasets: []
      }
    }
  },
  computed: {
    options () {
      if (this.type === 'line') {
        return {
          responsive: true,
          fill: true,
          maintainAspectRatio: false,
          lineTension: 0.3,
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      } else if (this.type === 'pie' || this.type === 'doughnut') {
        return { responsive: true, maintainAspectRatio: false }
      } else {
        return {}
      }
    }
  },
  mounted () {
    Chart.register(...registerables)
    const context = this.$refs.chart.getContext('2d')
    this.data.labels = this.labels
    this.data.datasets = this.datasets
    this.createChart(context)
  },
  methods: {
    createChart (context) {
      // var gradient = this.context.createLinearGradient(0, 0, 0, 450)
      // var gradient2 = this.context.createLinearGradient(0, 0, 0, 450)

      // gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
      // gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)')
      // gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

      // gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
      // gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)')
      // gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)')

      // chartData.data.datasets[0].backgroundColor = gradient
      // chartData.data.datasets[1].backgroundColor = gradient2

      const chart = new Chart(context, {
        type: this.type,
        data: this.data,
        options: this.options
      })
      console.log(chart)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
