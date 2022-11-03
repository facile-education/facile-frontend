<template>
  <div
    v-if="!isMultiSelectionActive"
    class="thread-list-options"
    :class="{'phone': mq.phone || mq.tablet}"
  >
    <!-- Display unread messages only toggle -->
    <div
      v-if="mq.phone || mq.tablet"
      class="unread"
    >
      <IconOption
        class="button"
        :icon="require('@/assets/options/icon_unread_filter.svg')"
        :title="$t('Messaging.unreadOnly')"
        name="toggleUnreadOnly"
        icon-height="16px"
        :alt="$t('unreadOnly')"
        @click="toggleUnreadOnly"
      />
    </div>

    <div class="buttons">
      <IconOption
        class="button"
        :icon="require('@assets/icon_engrenage.svg')"
        :title="$t('Messaging.Parameters.header')"
        name="toggleMessagingMenu"
        icon-height="16px"
        alt="parameters"
        @click="openParametersModal"
      />

      <IconOption
        v-if="!mq.tablet && !mq.phone"
        class="button"
        :icon="require('@/assets/options/icon_menu_lateral.svg')"
        :title="$t('Messaging.hideMenuPanel')"
        name="toggleMessagingMenu"
        icon-height="16px"
        alt="toggle menu"
        @click="toggleSideMenuPanel"
      />
      <IconOption
        v-if="!mq.tablet && !mq.phone"
        class="button"
        :icon="require('@/assets/options/icon_refresh.svg')"
        :title="$t('Messaging.refresh')"
        name="refresh"
        icon-height="16px"
        alt="refresh"
        @click="refresh"
      />
      <IconOption
        v-if="mq.tablet || mq.phone"
        class="button"
        :icon="require('@/assets/options/icon_edit_texte.svg')"
        :title="$t('Messaging.new')"
        name="createNewMessage"
        icon-height="16px"
        alt="new message"
        @click="createNewMessage"
      />
      <IconOption
        v-if="(!mq.tablet && !mq.phone)"
        class="button"
        :icon="require('@/assets/options/icon_unread_filter.svg')"
        :title="$t('Messaging.unreadOnly')"
        name="toggleUnreadOnly"
        icon-height="16px"
        :alt="$t('unreadOnly')"
        @click="toggleUnreadOnly"
      />
    </div>
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
      unreadOnly: false,
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
      switch (option) {
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
    createNewMessage () {
      messagingUtils.newMessage()
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

.thread-list-options {
  padding-left: 0;
  height: $messaging-mobile-footer-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $color-messaging-link-text;

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;

    .button {
      margin: 0 5px;
    }
  }

  .unread {
    display: flex;
    align-items: center;
    color: $color-messaging-dark-text;

    label {
      white-space: nowrap;
    }
  }

  &.phone {
    padding: 0 20px;
    height: $messaging-mobile-footer-height;
    background-color: $color-messaging-dark-white-bg;

    .unread {
      margin-left: 0;
    }
  }
}
</style>

<i18n locale="fr">
{
  "mark": "Marquer",
  "trash": "Supprimer"
}

</i18n>
