<template>
  <div
    v-if="groupList && groupList.length > 0"
    class="group-list"
  >
    <GroupItem
      v-for="group in groupList"
      :key="group.groupId"
      :group="group"
    />
  </div>
  <div
    v-else
    class="empty-container"
  >
    <span v-t="'noContentFound'" />
    <a
      v-t="'addGroup'"
      href="#"
      @click="toggleEditModalDisplay"
    />
  </div>
</template>

<script>

import GroupItem from '@components/Groups/GroupItem'
export default {
  name: 'GroupList',
  components: { GroupItem },
  data () {
    return {
      isEditModalDisplayed: false,
      selectedGroup: undefined
    }
  },
  computed: {
    groupList () {
      return this.$store.state.groups.groupList
    }
  },
  created () {
    this.$store.dispatch('groups/getGroupList', '')
  },

  methods: {
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
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  overflow: auto;
}

.empty-container {
  height: calc(100% - $groups-header-height);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50%;

  a {
    font-weight: bold;
    margin-top: 1rem;
  }
}

</style>

<i18n locale="fr">
{
  "noContentFound": "Aucun groupe.",
  "addGroup": "Créez votre groupe !"
}
</i18n>
