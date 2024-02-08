<template>
  <section>
    <header>
      <h2 v-t="'serviceActions'" />
      <WeprodeDropdown
        v-model="selectedService"
        :list="services"
        display-field="name"
        :sort="false"
        class="services"
        @update:model-value="onServiceSelect"
      />
    </header>
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <WeprodeSpinner />
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
import WeprodeUtils from '@utils/weprode.utils'

import { getStatServices } from '@/api/applicationManager.service'
import { getActionsCount } from '@/api/statistics.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import Chart from '@/components/Statistics/Chart.vue'

export default {
  name: 'ActionsChart',
  components: { Chart, WeprodeDropdown, WeprodeSpinner },
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

            this.services = WeprodeUtils.sortArrayWithString(data.services, false, 'name')
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
  "serviceActions": "Fréquentation par service (Nombre d'accès au service)"
}
</i18n>
