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
    fill: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'line'
    },
    centeredText: {
      type: [String, Number],
      default: undefined
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
          fill: this.fill,
          maintainAspectRatio: false,
          lineTension: 0.3,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            xAxis: {
              grid: {
                display: false
              }
            },
            yAxis: {
              grid: {
                display: true
              }
            }
          },
          elements: {
          },
          plugins: {
            legend: {
              position: 'bottom',
              align: 'start',
              labels: {
                usePointStyle: true,
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              usePointStyle: true
            }
          }
        }
      } else if (this.type === 'pie' || this.type === 'doughnut') {
        return {
          responsive: true,
          maintainAspectRatio: true,
          elements: {
            center: {
              text: this.centeredText,
              color: '#000000', // Default is #000000
              fontStyle: 'Arial', // Default is Arial
              sidePadding: 20, // Default is 20 (as a percentage)
              minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
              lineHeight: 25 // Default is 25 (in px), used for when text wraps
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              align: 'start',
              labels: {
                usePointStyle: true,
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              backgroundColor: '#fff',
              bodyColor: '#000',
              borderColor: '#D4D4D4',
              borderWidth: 1,
              bodyFont: { weight: 'bold', size: 14 },
              cornerRadius: 16,
              padding: 10,
              boxPadding: 5,
              caretSize: 0,
              callbacks: {
                label: function (context) {
                  const label = context.label
                  const currentValue = context.raw
                  const total = context.chart._metasets[context.datasetIndex].total

                  const percentage = parseFloat((currentValue / total * 100).toFixed(1))

                  return label + ': ' + currentValue + ' (' + percentage + '%)'
                }
              }
            }
          }
        }
      } else {
        return {}
      }
    }
  },
  mounted () {
    Chart.register(...registerables)
    const context = this.$refs.chart.getContext('2d')

    Chart.register({
      id: 'centerText',
      beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          const ctx = chart.ctx

          // New way to get InnerRadius from 3.0.0
          const innerRadius = chart._metasets[chart._metasets.length - 1].data[0].innerRadius
          // Get options from the center object in options
          const centerConfig = chart.config.options.elements.center
          const fontStyle = centerConfig.fontStyle || 'Arial'
          const txt = chart._metasets[chart._metasets.length - 1].total
          const color = centerConfig.color || '#000'
          const maxFontSize = centerConfig.maxFontSize || 75
          const sidePadding = centerConfig.sidePadding || 20
          const sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2)
          // Start with a base font of 30px
          ctx.font = '30px ' + fontStyle

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          const stringWidth = ctx.measureText(txt).width
          const elementWidth = (innerRadius * 2) - sidePaddingCalculated

          // Find out how much the font can grow in width.
          const widthRatio = elementWidth / stringWidth
          const newFontSize = Math.floor(30 * widthRatio)
          const elementHeight = (innerRadius * 2)

          // Pick a new font size so it will not be larger than the height of label.
          let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize)
          let minFontSize = centerConfig.minFontSize
          const lineHeight = centerConfig.lineHeight || 25
          let wrapText = false

          if (minFontSize === undefined) {
            minFontSize = 20
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize
            wrapText = true
          }

          // Set font settings to draw it correctly.
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2)
          let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2)
          ctx.font = fontSizeToUse + 'px ' + fontStyle
          ctx.fillStyle = color

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY)
            return
          }

          if (txt !== undefined && (typeof txt === 'string' || txt instanceof String)) {
            const words = txt.split(' ')
            let line = ''
            const lines = []

            // Break words up into multiple lines if necessary
            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' '
              const metrics = ctx.measureText(testLine)
              const testWidth = metrics.width
              if (testWidth > elementWidth && n > 0) {
                lines.push(line)
                line = words[n] + ' '
              } else {
                line = testLine
              }
            }

            // Move the center up depending on line height and number of lines
            centerY -= (lines.length / 2) * lineHeight

            for (let n = 0; n < lines.length; n++) {
              ctx.fillText(lines[n], centerX, centerY)
              centerY += lineHeight
            }
            // Draw text in center
            ctx.fillText(line, centerX, centerY)
          }
        }
      }
    })

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

      return chart
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
