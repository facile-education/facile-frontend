<template>
  <div
    data-test="group-item"
    class="group"
    @click="selectGroup"
  >
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
      <div class="separator" />
      <img
        class="button"
        src="@assets/edit.svg"
        data-test="edit-group-icon"
        :alt="$t('edit')"
        :title="$t('edit')"
        @click.stop="editGroup()"
      >
      <div class="separator" />
      <img
        class="button"
        src="@assets/trash.svg"
        data-test="delete-group-icon"
        :alt="$t('delete')"
        :title="$t('delete')"
        @click.stop="confirmGroupDeletion()"
      >
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
      isEditGroupModalDisplayed: false
    }
  },
  computed: {
    groupCategory () {
      if (this.group.isContactList) {
        return this.$t('institutionnal')
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
        lastAction: { fct: this.deleteGroup, params: [this.group] }
      })
    },
    deleteGroup () {
      this.$store.dispatch('groups/deleteGroup', this.group)
    },
    editGroup () {
      this.isEditGroupModalDisplayed = true
    },
    selectGroup () {
      // this.$router.push({ name: 'Group', params: { groupId: this.group.groupId } })
      this.$store.dispatch('groups/setSelectedGroup', this.group)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.group {
  display: flex;
  flex-direction: column;
  height: 235px;
  width: 285px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin: 20px;

  &:hover {
    border: 1px solid grey;
    cursor: pointer;
  }

  .header {
    padding: 10px 15px;
    border-radius: 6px 6px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    h3 {
      margin: 0;
    }
    span {
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
  }

  .buttons {
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
      height: 30px;
      border-right: 1px solid $color-border;
    }
  }
}

</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "edit": "Modifier",
  "institutionnal": "Institutionnel",
  "pedagogical": "Pédagogique",
  "warning": "La suppression de ce groupe est définitive."
}
</i18n>
