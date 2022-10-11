<template>
  <div class="container">
    <NeroToolbar>
      <PentilaButton
        class="create-button"
        @click="toggleEditModalDisplay()"
      >
        <NeroIcon
          name="fa-plus"
        />
        <span>{{ $t('add') }}</span>
      </PentilaButton>
    </NeroToolbar>

    <div
      v-if="groupList && groupList.length > 0"
      class="list"
    >
      <GroupItem
        v-for="group in groupList"
        :key="group.groupId"
        class="group"
        @edit="toggleEditModalDisplay"
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
        class="link"
        @click="toggleEditModalDisplay()"
      />
    </div>
    <teleport to="body">
      <EditGroupModal
        v-if="isEditModalDisplayed"
        :edited-group="selectedGroup"
        win-width="500px"
        @close="toggleEditModalDisplay"
      />
    </teleport>
  </div>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import NeroToolbar from '@/components/Nero/NeroToolbar'

import { defineAsyncComponent } from 'vue'
const EditGroupModal = defineAsyncComponent(() => import('@/components/Groups/EditGroupModal'))
const GroupItem = defineAsyncComponent(() => import('@/components/Groups/GroupItem'))

export default {
  name: 'GroupList',
  components: { EditGroupModal, NeroIcon, NeroToolbar, GroupItem },
  data () {
    return {
      isEditModalDisplayed: false,
      selectedGroup: undefined
    }
  },
  computed: {
    groupList () {
      return this.$store.state.group.groupList
    }
  },
  created () {
    if (this.groupList === undefined) {
      this.$store.dispatch('group/initGroupList')
    }
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

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.create-button {
  margin-left: 30px;
  width: 140px;
  border-radius: 32px;

  span {
    margin-left: 12px;
  }
}

.filters {
  margin-left: auto;
}

.filter {
  margin: 0 5px;
  min-width: 200px;
}

.list {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, 235px);
  grid-gap: 1rem;
}

.empty-container {
  margin: 1rem;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid $color-border;
  border-radius: $border-radius;
}

.link {
  font-weight: bold;
  margin-top: 1rem;
}
</style>

<i18n locale="fr">
{
  "add": "NOUVEAU",
  "filterBy": "Filtrer par :",
  "noContentFound": "Aucun groupe.",
  "addGroup": "Créez votre groupe !"
}
</i18n>
