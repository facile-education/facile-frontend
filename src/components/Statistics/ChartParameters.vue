<template>
  <div>
    <div class="filters">
      <h5 v-t="'Statistics.ChartParameters.filtersTitle'" />
      <PentilaTagsInput
        v-if="schoolList"
        v-model="schoolFilter"
        :list="schoolList"
        :placeholder="$t('Statistics.ChartParameters.schoolsPlaceholder')"
        display-field="schoolName"
        cls="form"
      />
      <PentilaTagsInput
        v-model="serviceFilter"
        :list="[]"
        :placeholder="$t('Statistics.ChartParameters.servicesPlaceholder')"
        cls="form"
      />
      <PentilaTagsInput
        v-model="roleFilter"
        :list="[]"
        :placeholder="$t('Statistics.ChartParameters.rolesPlaceholder')"
        cls="form"
      />
      <!-- $t('application-manager.edition-modal.schools-placeholder') -->
      <!-- display-field="schoolName" -->
    </div>

    <div class="dates">
      <h5 v-t="'Statistics.ChartParameters.datesLabel'" />
      <!-- https://github.com/charliekassel/vuejs-datepicker -->
      <p>
        {{ $t('Statistics.ChartParameters.startDate') }}
        Picker : Start Date
      </p>
      <p>
        {{ $t('Statistics.ChartParameters.endDate') }}
        Picker : End Date
      </p>

      <PentilaDropdown
        :list="[
          $t('Statistics.ChartParameters.dailyLabel'),
          $t('Statistics.ChartParameters.weeklyLabel'),
          $t('Statistics.ChartParameters.monthlyLabel'),
          $t('Statistics.ChartParameters.yearlyLabel')]"
        @dropdown-select="periodSelected"
      />
    </div>

    <div>
      <h5 v-t="'Statistics.ChartParameters.actionsTitle'" />
      {{ $t('Statistics.ChartParameters.compareOnLabel') }}
      <PentilaDropdown
        :list="[
          $t('Statistics.ChartParameters.doNotCompareLabel'),
          $t('Statistics.ChartParameters.schoolsLabel'),
          $t('Statistics.ChartParameters.servicesLabel'),
          $t('Statistics.ChartParameters.rolesLabel')]"
        @dropdown-select="compareSelected"
      />

      <PentilaButton
        :label="$t('Statistics.ChartParameters.exportButtonLabel')"
        @click="exportStats"
      />
      <PentilaButton
        :label="$t('Statistics.ChartParameters.searchButtonLabel')"
        @click="search"
      />
      <PentilaButton
        :label="$t('Statistics.ChartParameters.initButtonLabel')"
        @click="initParameterList"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartParameters',
  data () {
    return {
      schoolFilter: [],
      serviceFilter: [],
      roleFilter: []
    }
  },
  computed: {
    schoolList () {
      return this.$store.state.administration.schoolList
    }
  },
  created () {
    if (this.schoolList === undefined) {
      this.$store.dispatch('administration/getAdministrationSchools')
    }
  },
  methods: {
    compareSelected (value) {
      console.log(value)
    },
    periodSelected (value) {
      console.log(value)
    },
    initParameterList () {
      console.log('init')
    },
    search () {
      console.log('search')
    },
    exportStats () {
      console.log('export')
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  width: 49%;
  display: inline-block;
}

.dates {
  max-width: 40%;
  display: inline-block;
  margin-left: 15px;
  vertical-align: top;
}
</style>
