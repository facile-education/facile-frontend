<template>
  <div class="group-details">
    <section class="header theme-background-color">
      <div class="left-section">
        <h2>{{ selectedGroup.groupName }}</h2>
        <span v-if="groupCategory !== ''"> {{ groupCategory }}</span>
      </div>
      <div class="right-section">
        <button
          class="close-option"
          @click="closePanel"
        >
          <img
            src="@assets/options/icon_cross_white.svg"
            alt="close"
          >
        </button>
        <div class="group-options">
          <button
            class="option"
            @click="editGroup"
          >
            <img
              class="button"
              src="@assets/edit_white.svg"
              data-test="edit-group-icon"
              :alt="$t('edit')"
            >
          </button>
          <button
            class="option"
            @click="confirmGroupDeletion"
          >
            <img
              class="button"
              src="@assets/trash_white.svg"
              data-test="delete-group-icon"
              :alt="$t('delete')"
            >
          </button>
        </div>
      </div>
    </section>

    <section class="body">
      <PentilaTabList>
        <PentilaTabItem
          :title="$t('details')"
        >
          <GroupDetailsTab :group="selectedGroup" />
        </PentilaTabItem>
        <PentilaTabItem
          :title="$t('activities')"
        >
          <GroupActivityTab :group="selectedGroup" />
        </PentilaTabItem>
      </PentilaTabList>
    </section>
  </div>

  <teleport to="body">
    <EditGroupModal
      v-if="isEditGroupModalDisplayed"
      :edited-group="selectedGroup"
      win-width="500px"
      @close="isEditGroupModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import EditGroupModal from '@components/Groups/EditGroupModal'
import GroupDetailsTab from '@components/Groups/GroupDetailsTab'
import GroupActivityTab from '@components/Groups/GroupActivityTab'
export default {
  name: 'GroupDetails',
  components: { GroupActivityTab, GroupDetailsTab, EditGroupModal },
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
      if (this.selectedGroup.isContactList) {
        return this.$t('institutionnal')
      } else if (this.selectedGroup.isPedagogical) {
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
    closePanel () {
      this.$store.dispatch('groups/closePanel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.group-details {
  height: 100%;
  flex: 1;
  border-radius: 6px;
  border-left: 1px solid $color-border;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .header {
    height: $groups-details-header-height;
    padding: 15px 15px;
    border-radius: 6px 6px 0 0;
    display: flex;
    justify-content: space-between;

    .left-section {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      h2 {
        margin: 0;
      }

      span {
        margin-bottom: 10px;
        border-radius: 6px;
        border: 1px solid white;
        padding: 0 5px;
        font-size: 0.875rem;
        font-weight: 600;
      }
    }

    .right-section {
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

        img {
          width: 16px;
          height: 16px;
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

          img {
            border: 1px solid transparent;
          }

          &:hover {
            border: 1px solid grey;
          }
        }
      }
    }
  }

  .body {
    height: calc(100% - #{$groups-details-header-height});
    padding: 5px 10px;
  }
}

</style>

<i18n locale="fr">
{
  "delete": "Supprimer",
  "edit": "Modifier",
  "institutionnal": "Institutionnel",
  "pedagogical": "Pédagogique",
  "warning": "La suppression de ce groupe est définitive.",
  "details": "Détails",
  "activities": "Activités"
}
</i18n>
