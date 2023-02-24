<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="groupPickerWindow"
    :width="600"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span>{{ $t('news-groups') }}</span>
    </template>

    <template #body>
      <p>{{ nbSelectedGroups }}</p>
      <PentilaInput
        v-model="filter"
        :maxlength="200"
        :placeholder="$t('filterPlaceholder')"
      />

      <div
        v-for="category in filteredCategories"
        :key="category.categoryId"
        class="category"
      >
        <div
          class="category-name"
          @click="category.isExpanded = !category.isExpanded"
        >
          <span>{{ category.schoolName }}</span>
          <div class="arrow">
            <img
              v-if="!category.isExpanded"
              src="@assets/arrow-right.svg"
              :alt="$t('expand')"
              :title="$t('expand')"
            >
            <img
              v-else
              src="@assets/arrow-down.svg"
              :alt="$t('collapse')"
              :title="$t('collapse')"
            >
          </div>
        </div>
        <div
          v-if="category.isExpanded"
          class="groups"
        >
          <div
            v-for="group in filteredGroups(category.groups)"
            :key="group.groupId"
            class="group"
          >
            <span>{{ group.groupName }}</span>
            <input
              v-model="group.isSelected"
              type="checkbox"
              label=""
            >
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('add-groups')"
        class="button"
        @click="closeModal"
      />
    </template>
  </PentilaWindow>
</template>

<script>

import { getGroupNewsBroadcastGroups, getSchoolNewsBroadcastGroups } from '@/api/news.service'

export default {
  name: 'GroupPickerModal',
  inject: ['mq'],
  props: {
    isGroupNews: {
      type: Boolean,
      required: true
    },
    initialGroups: {
      type: Array,
      default: function () { return [] },
      required: false
    }
  },
  emits: ['close'],
  data () {
    return {
      categories: [],
      filter: ''
    }
  },
  computed: {
    filteredCategories () {
      const res = []
      for (let i = 0; i < this.categories.length; i++) {
        if (this.filter === '' || this.categories[i].schoolName.contains(this.filter)) {
          res.push(this.categories[i])
        }
      }
      return res
    },
    news () {
      return this.$store.state.dashboard.editedNews
    },
    selectedGroups () {
      const res = []
      for (let i = 0; i < this.categories.length; i++) {
        for (let j = 0; j < this.categories[i].groups.length; j++) {
          if (this.categories[i].groups[j].isSelected) {
            res.push(this.categories[i].groups[j])
          }
        }
      }
      return res
    },
    nbSelectedGroups () {
      if (this.selectedGroups.length === 0) {
        return this.$t('no-group-selected')
      } else if (this.selectedGroups.length === 1) {
        return '1 ' + this.$t('group-selected')
      } else {
        return this.selectedGroups.length + ' ' + this.$t('groups-selected')
      }
    }
  },
  created () {
    if (this.isGroupNews) {
      getGroupNewsBroadcastGroups().then(
        (data) => {
          if (data.success) {
            this.categories = data.schoolsGroups
            for (let i = 0; i < this.categories.length; i++) {
              for (let j = 0; j < this.categories[i].groups.length; j++) {
                const group = this.categories[i].groups[j]
                for (let k = 0; k < this.initialGroups.length; k++) {
                  const initialGroup = this.initialGroups[k]
                  if (initialGroup.groupId === group.groupId && initialGroup.roleId === group.roleId) {
                    group.isSelected = true
                  }
                }
              }
            }
          }
        }
      )
    } else {
      getSchoolNewsBroadcastGroups().then(
        (data) => {
          if (data.success) {
            this.categories = data.schoolsGroups
            for (let i = 0; i < this.categories.length; i++) {
              for (let j = 0; j < this.categories[i].groups.length; j++) {
                const group = this.categories[i].groups[j]
                for (let k = 0; k < this.initialGroups.length; k++) {
                  const initialGroup = this.initialGroups[k]
                  if (initialGroup.groupId === group.groupId && initialGroup.roleId === group.roleId) {
                    group.isSelected = true
                  }
                }
              }
            }
          }
        }
      )
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.selectedGroups)
    },
    filteredGroups (groups) {
      const res = []
      for (let i = 0; i < groups.length; i++) {
        if (this.filter === '' || groups[i].name.contains(this.filter)) {
          res.push(groups[i])
        }
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.groupPickerWindow {
  .category {
    .category-name {
      display: flex;
      justify-content: space-evenly;
      margin-right: 10px;
      span, .arrow {
        margin-right: 10px;
        margin: auto;
      }
    }
    .groups {
      .group {
        display: flex;
        span {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "news-groups": "Groupes de diffusion",
  "add-groups": "Enregistrer",
  "filterPlaceholder": "Rechercher un groupe ...",
  "expand": "Déplier",
  "collapse": "Replier",
  "no-group-selected": "Aucun groupe sélectionné",
  "group-selected": "groupe sélectionné",
  "groups-selected": "groupes sélectionnés"
}
</i18n>
