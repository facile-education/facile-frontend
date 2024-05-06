<template>
  <div class="entry-type-filter">
    <ul>
      <li
        v-for="(entryType) in entryTypes"
        :key="entryType.type"
      >
        <EntryTypeFilterItem
          :label="entryType.label"
          :type="entryType.type"
          :is-active="filterSelected === entryType.type"
          @add="addFilter"
          @remove="removeFilter"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import EntryTypeFilterItem from '@components/Logbook/EntryTypeFilterItem.vue'

import logbookConstants from '@/constants/logbookConstants'

export default {
  name: 'EntryTypeFilter',
  components: {
    EntryTypeFilterItem
  },
  data () {
    return {
      entryTypes: [{
        label: this.$t('Logbook.entriesItem.entryTypeInformation'),
        type: 1
      },
      {
        label: this.$t('Logbook.entriesItem.entryTypeAuthorization'),
        type: 2
      },
      {
        label: this.$t('Logbook.entriesItem.entryTypeObservation'),
        type: 3
      }
      ],
      selectedFilterType: 0,
      isDisplayFiltersType: false
    }
  },
  computed: {
    filterSelected () {
      return this.$store.state.logbook.filterTypeSelected
    },
    isFiltersDisplayed () {
      return this.$store.state.logbook.isFiltersDisplayed
    }
  },
  methods: {
    toggleFilters () {
      if (this.isFiltersDisplayed) {
        this.$store.dispatch('logbook/displayFilters', false)
      } else {
        this.$store.dispatch('logbook/displayFilters', true)
      }
    },
    addFilter (value) {
      this.$store.dispatch('logbook/addFilter', value)
    },
    removeFilter () {
      this.$store.dispatch('logbook/addFilter', logbookConstants.NONE_FILTERS)
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-type-filter {
  min-height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}

.display-filters {
  cursor: pointer;
  border: none;
}

ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 6px;
  align-items: center;
}
</style>
