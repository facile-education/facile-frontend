<template>
  <div>
    <div class="filters">
      <h5>Filters</h5>
      <NeroTagsInput
        v-model="schoolFilter"
        :list="[]"
        placeholder="Schools"
        cls="form"/>
      <NeroTagsInput
        v-model="serviceFilter"
        :list="[]"
        placeholder="Services"
        cls="form"/>
      <NeroTagsInput
        v-model="roleFilter"
        :list="[]"
        placeholder="Roles"
        cls="form"/>
        <!-- $t('application-manager.edition-modal.schools-placeholder') -->
        <!-- display-field="schoolName" -->
    </div>

    <div class="dates">
      <h5>Dates / period</h5>
      <!-- https://github.com/charliekassel/vuejs-datepicker -->
      <p>
        Label
        Picker : Start Date
      </p>
      <p>
        Label
        Picker : End Date
      </p>

      <NeroDropdown
        :list="['Dayly', 'Weekly', 'Monthly', 'Yearly']"
        @dropdown-select="periodSelected"/>
    </div>

    <div>
      <h5>Actions</h5>
      Label
      <NeroDropdown
        :list="['Do not compare', 'Schools', 'Services', 'Roles']"
        @dropdown-select="compareSelected"/>

      <NeroButton
        label="Export"
        @click="exportStats"/>
      <NeroButton
        label="Search"
        @click="search"/>
      <NeroButton
        label="Init"
        @click="initParameterList"/>
        <!-- :label="$t('CommunicationManager.ExternalRights.save')" -->
    </div>
  </div>
</template>

<script>
import NeroDropdown from '@/components/NeroDropdown'
import NeroButton from '@/components/NeroButton'
import NeroTagsInput from '@/components/NeroTagsInput'

export default {
  name: 'ChartParameters',
  components: {
    NeroButton,
    NeroDropdown,
    NeroTagsInput
  },
  data () {
    return {
      schoolFilter: [],
      serviceFilter: [],
      roleFilter: []
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
