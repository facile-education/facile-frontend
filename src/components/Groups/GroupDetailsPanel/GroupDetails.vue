<template>
  <div
    class="group-details"
    :class="{phone: mq.phone}"
    data-test="group-details-panel"
  >
    <section
      v-if="!mq.phone"
      class="header theme-background-color theme-border-color"
      :style="`background-color:${selectedGroup.color};border-color:${selectedGroup.color} !important;`"
    >
      <div class="overlay">
        <div class="left-section">
          <h2>{{ selectedGroup.groupName ? selectedGroup.groupName : selectedGroup.name }}</h2>
          <span v-if="groupCategory !== ''"> {{ groupCategory }}</span>
        </div>

        <div class="right-section">
          <button
            class="close-option"
            data-test="close-panel"
            :title="$t('Groups.GroupDetails.close')"
            @click="closePanel"
          >
            <CustomIcon
              icon-name="icon-cross-L"
              class="icon"
            />
          </button>
          <div
            v-if="selectedGroup.isAdmin"
            class="group-options"
          >
            <button
              v-if="!selectedGroup.isExpired"
              class="option"
              data-test="edit-group-option"
              :title="$t('Groups.GroupDetails.edit')"
              @click="editGroup"
            >
              <CustomIcon icon-name="icon-edit" />
            </button>
            <button
              class="option"
              data-test="delete-group-option"
              :title="$t('Groups.GroupDetails.delete')"
              :aria-label="$t('Groups.GroupDetails.delete')"
              @click="confirmGroupDeletion"
            >
              <CustomIcon :icon-name="'icon-trash'" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section
      class="body"
      :class="{phone: mq.phone}"
    >
      <WeprodeTabList>
        <WeprodeTabItem
          style="height: calc(100% - 37px)"
          :title="$t('Groups.GroupDetails.details')"
        >
          <GroupDetailsTab :group="selectedGroup" />
        </WeprodeTabItem>
        <WeprodeTabItem
          style="height: calc(100% - 37px)"
          :title="$t('Groups.GroupDetails.activities')"
        >
          <GroupActivityTab :group="selectedGroup" />
        </WeprodeTabItem>
      </WeprodeTabList>
    </section>
  </div>

  <teleport to="body">
    <EditGroupModal
      v-if="isEditGroupModalDisplayed && selectedGroup"
      :edited-group="selectedGroup"
      win-width="500px"
      @close="isEditGroupModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import GroupActivityTab from '@components/Groups/GroupDetailsPanel/ActivityTab/GroupActivityTab'
import GroupDetailsTab from '@components/Groups/GroupDetailsPanel/DetailsTab/GroupDetailsTab'
import { defineAsyncComponent } from 'vue'

import WeprodeTabItem from '@/components/Base/Weprode/WeprodeTabItem.vue'
import WeprodeTabList from '@/components/Base/Weprode/WeprodeTabList.vue'
const EditGroupModal = defineAsyncComponent(() => import('@components/Groups/EditGroupModal/EditGroupModal'))

export default {
  name: 'GroupDetails',
  components: { CustomIcon, GroupActivityTab, GroupDetailsTab, EditGroupModal, WeprodeTabList, WeprodeTabItem },
  inject: ['mq'],
  data () {
    return {
      isEditGroupModalDisplayed: false
    }
  },
  computed: {
    selectedGroup () {
      return this.$store.state.groups.selectedGroup
    },
    groupCategory () {
      if (this.selectedGroup) {
        if (this.selectedGroup.isClass) {
          return this.$t('Groups.GroupDetails.class')
        } else if (this.selectedGroup.isPedagogical) {
          return this.$t('Groups.GroupDetails.pedagogical')
        } else if (this.selectedGroup.isSubject) {
          return this.$t('Groups.GroupDetails.subject')
        } else if (this.selectedGroup.isSchool) {
          return this.$t('Groups.GroupDetails.school')
        } else if (this.selectedGroup.isInstitutional) {
          return this.$t('Groups.GroupDetails.institutionnal')
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    confirmGroupDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Groups.GroupDetails.warning'),
        lastAction: { fct: this.deleteGroup }
      })
    },
    deleteGroup () {
      this.$store.dispatch('groups/deleteGroup', this.selectedGroup)
    },
    editGroup () {
      this.isEditGroupModalDisplayed = true
    },
    closePanel () {
      this.$store.dispatch('groups/closePanel')
      this.$store.dispatch('documents/closeDocumentPanel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.group-details {
  height: 100%;
  flex: 1;
  border-left: 1px solid $color-border;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  min-width: 396px;
  margin-left: 20px;

  &.phone {
    border: none;
    box-shadow: none;
    min-width: 100px;
    margin-left: 0;
  }
}

.header {
  height: $groups-details-header-height;
  border-left: 10px solid;
}

.overlay {
  height: 100%;
  padding: 15px;
  display: flex;
  background-color: #ffffff99;
}

.left-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  color: initial;

  h2 {
    margin: 0;
  }

  span {
    margin-bottom: 10px;
    border-radius: 6px;
    border: 1px solid $color-dark-text;
    padding: 0 5px;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.right-section {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .close-option {
    margin-left: auto;
    width: 40px;
    height: 28px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;

    .icon {
      font-size: 1.25rem;
      font-weight: bold;
    }
  }

  .group-options {
    display: flex;

    .option {
      border: 1px solid transparent;
      border-radius: 5px;
      padding: 5px;
      cursor: pointer;
      background-color: transparent;
      height: 32px;
      display: flex;
      align-items: center;

      img {
        border: 1px solid transparent;
          height: 16px;
      }

      &:hover {
        border: 1px solid grey;
      }
    }
  }
}

.body {
  height: calc(100% - #{$groups-details-header-height});
  padding: 5px 10px;

  &.phone {
    padding: 0;
  }
}
</style>
