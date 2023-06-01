<template>
  <section>
    <header>
      <h2 v-t="'serviceActions'" />
      <PentilaDropdown
        v-model="selectedService"
        :list="services"
        display-field="name"
        :sort="false"
        class="services"
        @update:modelValue="onServiceSelect"
      />
    </header>
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
        :fill="comparator === ''"
      />
    </div>
  </section>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import { getStatServices } from '@/api/applicationManager.service'
import { getActionsCount } from '@/api/statistics.service'

import Chart from '@/components/Statistics/Chart.vue'

export default {
  name: 'ActionsChart',
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
      error: false,
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
      this.getData()
    }
  },
  created () {
    this.getServices()
    this.getData()
  },
  methods: {
    getData () {
      this.isLoading = true
      getActionsCount(this.selectedSchool.schoolId, (this.selectedService === undefined ? 0 : this.selectedService.applicationId), this.startTime, this.endTime, this.comparator).then((data) => {
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

            this.services = PentilaUtils.Array.sortWithString(data.services, false, 'name')
            // Select 'TDB' by default
            this.selectedService = data.services.find(service => service.applicationId === 0)
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
  margin-right: 30px;
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

<i18n locale="fr">
{
  "allServices": "Tous les services",
  "error": "Oups, une erreur est survenue...",
  "serviceActions": "Fréquentation par services (Nombre d'accès aux services)"
}
</i18n>