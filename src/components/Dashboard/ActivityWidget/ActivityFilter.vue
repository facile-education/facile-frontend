<template>
  <div class="activity-filter">
    <button
      v-t="'Dashboard.ActivityFilter.filter'"
      class="filter-label"
      @click="isFiltersDisplayed=!isFiltersDisplayed"
    />
    <div
      v-if="isFiltersDisplayed"
      class="filters"
    >
      <ol class="type-filter">
        <li
          v-for="(type, index) in availableActivityTypes"
          :key="index"
        >
          <ActivityFilterItem
            :name="$t('Dashboard.ActivityFilter.' + type)"
            :is-active="isActive(type)"
            @add="addType(type)"
            @remove="removeType(type)"
          />
        </li>
      </ol>

      <div
        v-if="isLoadingGroups"
        class="spinner-container"
      >
        <WeprodeSpinner />
      </div>
      <WeprodeDropdown
        v-else
        v-model="filter.selectedGroup"
        :list="groupList"
        :sort="false"
        class="dropdown"
        display-field="groupName"
        @update:model-value="$emit('updateFilter', filter)"
      />
    </div>
  </div>
</template>

<script>
import ActivityFilterItem from '@components/Dashboard/ActivityWidget/ActivityFilterItem.vue'

import { getUserCommunities } from '@/api/groups.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'ActivityFilter',
  components: { ActivityFilterItem, WeprodeDropdown, WeprodeSpinner },
  props: {
    initialFilter: {
      type: Object,
      required: true
    },
    isFiltersDisplayedByDefault: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateFilter'],
  data () {
    return {
      allGroups: { groupId: 0, groupName: this.$t('Dashboard.ActivityFilter.allGroups') },
      filter: undefined,
      availableActivityTypes: ['news', 'docs', 'schoolLife', 'sessions'],
      groupList: [],
      isLoadingGroups: false,
      isFiltersDisplayed: false
    }
  },
  created () {
    this.isFiltersDisplayed = this.isFiltersDisplayedByDefault
    this.filter = this.initialFilter
    this.getGroupList()
  },
  methods: {
    getGroupList () {
      this.isLoadingGroups = true
      getUserCommunities(this.$store.state.user.userId, { label: '', isCommunityActive: false, isInstitutionalActive: false, isPedagogicalActive: false }).then((data) => {
        this.isLoadingGroups = false
        if (data.success) {
          this.groupList = data.groups
          this.groupList.unshift(this.allGroups)
          this.filter.selectedGroup = this.allGroups
        }
      })
    },
    isActive (type) {
      return this.filter.activityTypes.indexOf(type) !== -1
    },
    addType (type) {
      this.filter.activityTypes.push(type)
      this.$emit('updateFilter', this.filter)
    },
    removeType (type) {
      const index = this.filter.activityTypes.indexOf(type)
      if (index !== -1) {
        this.filter.activityTypes.splice(index, 1)
        this.$emit('updateFilter', this.filter)
      } else {
        console.error('Cannot remove filter type ' + type)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.filter-label {
  height: 1.25rem;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.activity-filter {
  margin-bottom: 5px
}

.filter-label {
  font-size: 0.8rem;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.spinner-container {
  position: relative;
  min-width: 80px;
}

.dropdown {
  margin-left: 10px;
  white-space: nowrap;
}

</style>
