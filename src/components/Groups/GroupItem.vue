<template>
  <div
    ref="group"
    data-test="group-item"
    class="group"
    :class="{'phone': mq.phone}"
    @click="selectGroup"
  >
    <WeprodeSpinner v-if="isLoading" />

    <div
      class="header theme-background-color theme-border-color"
      :style="`background-color:${group.color};border-color:${group.color} !important;`"
      :title="group.groupName"
    >
      <div class="overlay">
        <h3>{{ group.groupName }}</h3>
        <span v-if="groupCategory !== ''"> {{ groupCategory }}</span>
      </div>
    </div>

    <p class="body">
      {{ group.description }}
    </p>

    <div class="buttons">
      <div class="members">
        <span>{{ group.nbMembers }}</span>
        <CustomIcon
          icon-name="icon-users"
          :title="$tc('Groups.GroupItem.members', group.nbMembers)"
        />
      </div>
      <div
        v-if="hasEditionRights"
        class="separator"
      />
      <button
        v-if="hasEditionRights"
        class="button"
        data-test="edit-group-icon"
        :title="$t('Groups.GroupItem.edit')"
        :aria-label="$t('Groups.GroupItem.edit')"
        @click.stop="editGroup()"
      >
        <CustomIcon icon-name="icon-edit" />
      </button>
      <div
        v-if="hasEditionRights"
        class="separator"
      />
      <button
        v-if="hasEditionRights"
        class="button"
        data-test="delete-group-icon"
        :title="$t('Groups.GroupItem.delete')"
        :aria-label="$t('Groups.GroupItem.delete')"
        @click.stop="confirmGroupDeletion()"
      >
        <CustomIcon :icon-name="'icon-trash'" />
      </button>
    </div>

    <div
      v-if="group.isExpired"
      class="expired"
    >
      <p v-t="'Groups.GroupItem.disabledSpace'" />
      <button
        v-if="hasEditionRights"
        class="activate-button button"
        @click.stop="extendGroup"
      >
        {{ $t('Groups.GroupItem.reactivate') }}
      </button>
    </div>
  </div>

  <teleport to="body">
    <EditGroupModal
      v-if="isEditGroupModalDisplayed"
      :edited-group="group"
      win-width="500px"
      @close="isEditGroupModalDisplayed=false"
    />
  </teleport>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'

import { extendCommunity } from '@/api/groups.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const EditGroupModal = defineAsyncComponent(() => import('@components/Groups/EditGroupModal/EditGroupModal'))

export default {
  name: 'GroupItem',
  components: { CustomIcon, EditGroupModal, WeprodeSpinner },
  inject: ['mq'],
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  emits: ['edit'],
  data () {
    return {
      isLoading: false,
      isEditGroupModalDisplayed: false
    }
  },
  computed: {
    groupCategory () {
      if (this.group.isClass) {
        return this.$t('Groups.GroupItem.class')
      } else if (this.group.isPedagogical) {
        return this.$t('Groups.GroupItem.pedagogical')
      } else if (this.group.isSubject) {
        return this.$t('Groups.GroupItem.subject')
      } else if (this.group.isSchool) {
        return this.$t('Groups.GroupItem.school')
      } else if (this.group.isInstitutional) {
        return this.$t('Groups.GroupItem.institutional')
      } else {
        return ''
      }
    },
    hasEditionRights () {
      return (this.group.isAdmin && !this.group.isInstitutional)
    },
    isSelected () {
      return this.$store.state.groups.selectedGroup && this.$store.state.groups.selectedGroup.groupId === this.group.groupId
    }
  },
  watch: {
    isSelected: {
      handler (value) {
        if (value) {
          this.$nextTick(() => {
            // Bring the selected group to top of the page
            this.$refs.group.scrollIntoView({ block: 'start', behavior: 'smooth' })
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    confirmGroupDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('Groups.GroupItem.warning'),
        lastAction: { fct: this.deleteGroup }
      })
    },
    deleteGroup () {
      this.$store.dispatch('groups/deleteGroup', this.group)
    },
    editGroup () {
      this.isEditGroupModalDisplayed = true
    },
    selectGroup () {
      this.$store.dispatch('groups/setSelectedGroup', this.group)
    },
    extendGroup () {
      this.isLoading = true
      extendCommunity(this.group.groupId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.$store.dispatch('groups/getGroupList', { filter: this.$store.state.groups.currentFilter })
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Groups.GroupItem.extension-success'), type: 'info' })
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.group {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 235px;
  width: 285px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: $border-radius;

  &:hover {
    border: 1px solid grey;
    cursor: pointer;
  }

  &.phone {
    height: 185px;
    width: 160px;

    .body {
      padding: 0 15px;
    }
  }
}

.header {
  border-left: 10px solid;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
  height: 62px;
  min-height: 62px;
  color: inherit;
}

.overlay {
  height: 100%;
  display: flex;
  border-top-right-radius: $border-radius;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 5px;
  background-color: #ffffff99;
  overflow: hidden;

  h3 {
    width: 100%;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    margin-top: 5px;
    border-radius: 6px;
    border: 1px solid $color-dark-text;
    padding: 0 5px;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.body {
  padding: 10px 15px;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: auto;
  max-height: calc(235px - 62px - 10px - 32px);
}

.buttons {
  height: 32px;
  margin-top: auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .members {
    display: flex;
    align-items: center;

    span {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .icon-users {
      margin: 0 4px;
      font-size: 26px;
    }
  }

  .button {
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    background-color: transparent;
    display: flex;

    &:hover {
      border: 1px solid grey;
    }

    img {
      height: 16px;
    }
  }

  .separator {
    height: 25px;
    margin: 0 2px;
    border-right: 1px solid $color-border;
  }
}

.expired {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(225,225,225  ,.8);
  cursor: default;

  p {
    font-weight: 600;
    color: rgba(238, 139, 25, 0.637);
  }

  .activate-button {
    float: left;
    cursor: pointer;
    border: 1px solid transparent;
    background-color: transparent;
    color: rgb(79, 79, 218);
    font-weight: 600;
    &:hover {
      border: 1px solid grey;
    }
  }

}
</style>
