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
    <span v-t="'Groups.GroupList.noContentFound'" />
    <a
      v-if="canCreateGroup"
      v-t="'Groups.GroupList.addGroup'"
      href="#"
      @click="isEditModalDisplayed=true"
    />
  </div>
  <WeprodeSpinner v-else />

  <teleport
    v-if="isEditModalDisplayed"
    to="body"
  >
    <EditGroupModal
      @close="isEditModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import GroupItem from '@components/Groups/GroupItem'
import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'

import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const EditGroupModal = defineAsyncComponent(() => import('@components/Groups/EditGroupModal/EditGroupModal'))

export default {
  name: 'GroupList',
  components: { EditGroupModal, GroupItem, WeprodeSpinner },
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 28vh;
  border: 1px solid $color-border;
  gap: 1rem;

  a {
    font-weight: bold;
  }
}
</style>
