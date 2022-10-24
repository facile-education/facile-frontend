<template>
  <div
    data-test="group-item"
    class="group"
    @click="selectGroup()"
  >
    <div
      class="header"
      :style="`background-color:${group.color};`"
    >
      <h3>{{ group.name }}</h3>
    </div>
    <div class="buttons">
      <img
        class="button"
        src="@assets/edit.svg"
        data-test="edit-group-icon"
        :alt="$t('edit')"
        :title="$t('edit')"
        @click.stop="editGroup()"
      >
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
      this.$router.push({ name: 'Group', params: { groupId: this.group.groupId } })
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
  max-height: 235px;
  width: 235px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    border: 1px solid grey;
    cursor: pointer;
  }
}

.body {
  padding: 10px 15px;
}

.buttons {
  margin-top: auto;
  padding: 0 15px;
  text-align: right;

  .button {
    border: 1px solid transparent;
    border-radius: 5px;
    padding: 5px;
    margin: 0 0 5px 5px;

    &:hover {
      border: 1px solid grey;
      cursor: pointer;
    }
  }
}
</style>

<i18n locale="fr">
{
  "warning": "La suppression de ce groupe est définitive.",
  "edit": "Modifier",
  "delete": "Supprimer"
}
</i18n>
