<template>
  <div
    v-if="groupList && groupList.length > 0"
    class="group-list"
    :class="{'phone': mq.phone}"
  >
    <GroupItem
      v-for="group in sortedGroupList"
      :key="group.groupId"
      :group="group"
    />
  </div>
  <div
    v-else-if="groupList !== undefined"
    class="empty-container"
  >
    <span v-t="'noContentFound'" />
    <a
      v-if="canCreateGroup"
      v-t="'addGroup'"
      href="#"
      @click="toggleEditModalDisplay"
    />
  </div>
  <WeprodeSpinner v-else />
</template>

<script>
import GroupItem from '@components/Groups/GroupItem'
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'GroupList',
  components: { GroupItem, WeprodeSpinner },
  inject: ['mq'],
  data () {
    return {
      isEditModalDisplayed: false,
      selectedGroup: undefined
    }
  },
  computed: {
    canCreateGroup () {
      return !this.$store.state.user.isStudent && !this.$store.state.user.isParent
    },
    groupList () {
      return this.$store.state.groups.groupList
    },
    sortedGroupList () {
      return WeprodeUtils.sortArrayWithString(this.groupList, false, 'groupName')
    }
  },
  created () {
    this.getGroupList()
    // Reset this.$route.params.groupId ?
  },
  methods: {
    getGroupList () {
      const groupId = (this.$route.params.groupId !== undefined) ? Number(this.$route.params.groupId) : undefined
      this.$store.dispatch('groups/getGroupList', { filter: this.$store.state.groups.currentFilter, groupIdToSelect: groupId })
    },
    toggleEditModalDisplay (group) {
      this.selectedGroup = group
      this.isEditModalDisplayed = !this.isEditModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.group-list {
  width: 100%;
  overflow: auto;
  flex: 1;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, 285px);
  justify-content: space-evenly;

  &.phone {
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fill, 160px);
  }
}

.empty-container {
  @extend %empty-container ;
}
</style>

<i18n locale="fr">
{
  "noContentFound": "Aucun groupe.",
  "addGroup": "Créez votre groupe !"
}
</i18n>
