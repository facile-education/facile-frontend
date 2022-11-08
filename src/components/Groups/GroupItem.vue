<template>
  <div
    data-test="group-item"
    class="group"
    @click="selectGroup"
  >
    <PentilaSpinner v-if="isLoading" />

    <div
      class="header theme-background-color"
      :style="`background-color:${group.color};`"
    >
      <h3>{{ group.groupName }}</h3>
      <span v-if="groupCategory !== ''"> {{ groupCategory }}</span>
    </div>

    <div class="body">
      {{ group.description }}
    </div>

    <div class="buttons">
      <div class="members">
        <span>{{ group.nbMembers }}</span>
        <img
          src="@assets/icon_commu-black.svg"
          :title="$t('edit')"
          alt=""
        >
      </div>
      <div
        v-if="group.isAdmin"
        class="separator"
      />
      <img
        v-if="group.isAdmin"
        class="button"
        src="@assets/edit.svg"
        data-test="edit-group-icon"
        :alt="$t('edit')"
        :title="$t('edit')"
        @click.stop="editGroup()"
      >
      <div
        v-if="group.isAdmin"
        class="separator"
      />
      <img
        v-if="group.isAdmin"
        class="button"
        src="@assets/trash.svg"
        data-test="delete-group-icon"
        :alt="$t('delete')"
        :title="$t('delete')"
        @click.stop="confirmGroupDeletion()"
      >
    </div>

    <div
      v-if="group.isExpired"
      class="expired"
    >
      <p v-t="'desactivedSpace'" />
      <button
        v-if="group.isAdmin"
        @click.stop="extendGroup"
      >
        {{ $t('reactivate') + group.groupName }}
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

import { defineAsyncComponent } from 'vue'
import { extendCommunity } from '@/api/groups.service'
const EditGroupModal = defineAsyncComponent(() => import('@/components/Groups/EditGroupModal'))

export default {
  name: 'GroupItem',
  components: { EditGroupModal },
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
      if (this.group.isContactList) {
        return this.$t('institutional')
      } else if (this.group.isPedagogical) {
        return this.$t('pedagogical')
      } else {
        return ''
      }
    }
  },
  methods: {
    confirmGroupDeletion () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
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
          this.$store.dispatch('groups/getGroupList', this.$store.state.groups.currentFilter)
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
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0 20px 40px 20px;

  &:hover {
    border: 1px solid grey;
    cursor: pointer;
  }

  .header {
    padding: 0 15px;
    border-radius: 6px 6px 0 0;
    display: flex;
    height: 62px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    color: white;

    h3 {
      margin: 0;
    }
    span {
      margin-top: 5px;
      border-radius: 6px;
      border: 1px solid white;
      padding: 0 5px;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }

  .body {
    padding: 10px 15px;
    font-weight: 600;
    font-size: 0.875rem;
    color: black;
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
      padding: 0 5px;

      span {
        font-weight: 600;
        font-size: 0.875rem;
      }

      img {
        margin-left: 5px;
        height: 30px;
        width: 30px;
      }
    }

    .button {
      border: 1px solid transparent;
      border-radius: 5px;
      padding: 5px;
      cursor: pointer;

      &:hover {
        border: 1px solid grey;
      }
    }

    .separator {
      height: 25px;
      border-right: 1px solid $color-border;
    }
  }

  .expired {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: rgba(225,225,225  ,.8);
    cursor: default;

    p {
      color: red;
    }

    button {
      cursor: pointer;
      background-color: transparent;
      border: none;
      &:hover {
        font-weight: 600;
      }
    }
  }
}

</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "edit": "Modifier",
  "institutional": "Institutionnel",
  "pedagogical": "Pédagogique",
  "warning": "La suppression de ce groupe est définitive.",
  "desactivedSpace": "Espace désactivé avant suppression",
  "reactivate": "Je souhaite réactiver "
}
</i18n>
