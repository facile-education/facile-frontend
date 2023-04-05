<template>
  <div
    v-if="!isMultiSelectionActive"
    class="thread-list-options"
    :class="{'phone': mq.phone || mq.tablet}"
  >
    <!-- Display unread messages only toggle -->
    <IconOption
      v-if="mq.phone || mq.tablet"
      class="button"
      :icon="unreadOnly ? require('@/assets/options/icon_unread_filter_active.svg') : require('@/assets/options/icon_unread_filter.svg')"
      :title="unreadOnly ? $t('all') : $t('Messaging.unreadOnly')"
      name="toggleUnreadOnly"
      icon-height="20px"
      :alt="$t('unreadOnly')"
      @click="toggleUnreadOnly"
    />

    <ul class="buttons">
      <li>
        <IconOption
          class="button"
          :icon="require('@assets/icon_engrenage.svg')"
          :title="$t('Messaging.Parameters.header')"
          name="toggleParameters"
          icon-height="18px"
          alt="parameters"
          @click="openParametersModal"
        />
      </li>
      <li>
        <IconOption
          v-if="!mq.tablet && !mq.phone"
          class="button"
          :icon="require('@/assets/options/icon_menu_lateral.svg')"
          :title="isMenuPanelDisplayed ? $t('hideMenuPanel') : $t('displayMenuPanel')"
          name="toggleMessagingMenu"
          icon-height="18px"
          alt="toggle menu"
          @click="toggleSideMenuPanel"
        />
      </li>
      <li>
        <IconOption
          v-if="!mq.tablet && !mq.phone"
          class="button"
          :icon="require('@/assets/options/icon_refresh.svg')"
          :title="$t('refresh')"
          name="refresh"
          icon-height="18px"
          alt="refresh"
          @click="refresh"
        />
      </li>
      <li>
        <IconOption
          v-if="(!mq.tablet && !mq.phone)"
          class="button"
          :icon="unreadOnly ? require('@/assets/options/icon_unread_filter_active.svg') : require('@/assets/options/icon_unread_filter.svg')"
          :title="unreadOnly ? $t('all') : $t('Messaging.unreadOnly')"
          name="toggleUnreadOnly"
          icon-height="18px"
          :alt="$t('unreadOnly')"
          @click="toggleUnreadOnly"
        />
      </li>
    </ul>
  </div>

  <div
    v-else
    class="thread-list-options"
    :class="{'phone': mq.phone || mq.tablet}"
  >
    <span
      v-t="'mark'"
      @click="displayMarkerSelection"
    />
    <span
      v-t="'trash'"
      @click="deleteSelectedThreads"
    />
  </div>

  <ContextMenu
    v-if="isAContextMenuDisplayed && isMarkerSelectionDisplayed"
    @chooseOption="performChosenOption"
    @close="closeMarkerSelection"
  />
</template>

<script>
import contextMenus from '@utils/contextMenus'
import messagingUtils from '@utils/messaging.utils'
import IconOption from '@components/Base/IconOption'
import ContextMenu from '@components/ContextMenu/ContextMenu'

export default {
  name: 'ThreadListOptions',
  components: { ContextMenu, IconOption },
  inject: ['mq'],
  data () {
    return {
      isMarkerSelectionDisplayed: false
    }
  },
  computed: {
    isMultiSelectionActive () {
      return this.$store.state.messaging.isMultiSelectionActive
    },
    isAContextMenuDisplayed () {
      return this.$store.state.contextMenu.isAContextMenuDisplayed
    },
    selectedThreads () {
      return this.$store.state.messaging.selectedThreads
    },
    isMenuPanelDisplayed () {
      return this.$store.state.messaging.isMenuPanelDisplayed
    },
    currentFolderName () {
      return this.$store.state.messaging.currentFolder.folderName
    },
    currentFolder () {
      return this.$store.state.messaging.currentFolder
    },
    formattedCurrentFolderName () {
      return this.currentFolderName ? this.currentFolderName.toUpperCase() : ''
    },
    nbNewMessages () {
      return this.$store.state.messaging.nbNewMessages
    },
    unreadOnly () {
      return this.$store.state.messaging.unreadOnly
    }
  },
  methods: {
    openParametersModal () {
      this.$store.dispatch('messaging/openParametersModal')
    },
    toggleSideMenuPanel () {
      this.$store.dispatch('messaging/toggleSideMenuPanel')
    },
    toggleMultiSelection () {
      this.$store.dispatch('messaging/toggleMultiSelection')
    },
    displayMarkerSelection (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isMarkerSelectionDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event: event,
            options: contextMenus.messagingMarkerMenu
          })
      }
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'markAsRead':
          messagingUtils.markMessagesAsReadUnread(this.selectedThreads.map(t => t.mainMessageId), true)
          break
        case 'markAsUnread':
          messagingUtils.markMessagesAsReadUnread(this.selectedThreads.map(t => t.mainMessageId), false)
          break
      }
      this.closeMarkerSelection()
      this.$store.dispatch('contextMenu/closeMenus')
      this.toggleMultiSelection()
    },
    closeMarkerSelection () {
      this.isMarkerSelectionDisplayed = false
    },
    deleteSelectedThreads () {
      messagingUtils.deleteSelectedThreads().then(() => {
        this.toggleMultiSelection()
      })
    },
    refresh () {
      messagingUtils.refresh()
    },
    toggleUnreadOnly () {
      this.$store.dispatch('messaging/toggleUnreadOnly')
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
}

.thread-list-options {
  padding-left: 0;
  height: $messaging-mobile-footer-height;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 60%;

    .button {
      margin: 0 5px;
    }
  }

  &.phone {
    padding: 0 20px;
    height: $messaging-mobile-footer-height;
    background-color: $color-messaging-bg;

    .buttons {
      opacity: 100%;
    }
  }
}
</style>

<i18n locale="fr">
{
  "mark": "Marquer",
  "trash": "Supprimer",
  "displayMenuPanel": "Afficher le menu",
  "hideMenuPanel": "Cacher le menu",
  "all": "Tous",
  "refresh": "Rafraîchir"
}

</i18n>
