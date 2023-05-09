<template>
  <div class="activity-filter">
    <div
      v-t="'filter'"
      class="filter-label"
    />
    <div class="filters">
      <ol class="type-filter">
        <li
          v-for="(type, index) in availableActivityTypes"
          :key="index"
        >
          <ActivityFilterItem
            :name="$t(type)"
            :is-active="isActive(type)"
            @add="addType(type)"
            @remove="removeType(type)"
          />
        </li>
      </ol>

      <PentilaDropdown
        v-model="filter.selectedGroup"
        :list="groupList"
        :sort="false"
        class="dropdown"
        display-field="groupName"
        @update:modelValue="$emit('updateFilter', filter)"
      />
    </div>
  </div>
</template>

<script>
import { getUserCommunities } from '@/api/groups.service'
import ActivityFilterItem from '@components/Dashboard/ActivityWidget/ActivityFilterItem.vue'

export default {
  name: 'ActivityFilter',
  components: { ActivityFilterItem },
  props: {
    initialFilter: {
      type: Object,
      required: true
    }
  },
  emits: ['updateFilter'],
  data () {
    return {
      filter: undefined,
      availableActivityTypes: ['news', 'docs', 'schoolLife', 'membership', 'sessions'],
      groupList: []
    }
  },
  created () {
    this.filter = this.initialFilter
    this.getGroupList()
  },
  methods: {
    getGroupList () {
      getUserCommunities(this.$store.state.user.userId, { label: '', isCommunityActive: false, isInstitutionalActive: false, isPedagogicalActive: false }).then((data) => {
        if (data.success) {
          const allGroupObject = { groupId: -1, groupName: this.$t('allGroups') }
          this.groupList = data.groups
          this.groupList.unshift(allGroupObject)
          this.filter.selectedGroup = allGroupObject
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

.dropdown {
  white-space: nowrap;
}

</style>

<i18n locale="fr">
{
  "allGroups": "Tous les groupes",
  "filter": "Filtrer",
  "news": "Nouveautés",
  "docs": "Documents",
  "schoolLife": "Vie scolaire",
  "membership": "Cycle de vie des groupes",
  "sessions": "Cours et devoirs"
}
</i18n>
