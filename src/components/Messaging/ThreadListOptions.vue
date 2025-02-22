<template>
  <div
    class="thread-list-options"
    :class="{'phone': mq.phone || mq.tablet}"
  >
    <ul class="buttons">
      <li>
        <IconOption
          class="button"
          :icon="unreadOnly ? 'icon-filter-plain' : 'icon-filter'"
          :title="unreadOnly ? $t('Messaging.ThreadListOptions.all') : $t('Messaging.unreadOnly')"
          :active="unreadOnly"
          name="toggleUnreadOnly"
          icon-height="18px"
          :alt="$t('Messaging.unreadOnly')"
          @click="toggleUnreadOnly"
        />
      </li>
      <li v-if="!mq.tablet && !mq.phone">
        <IconOption
          class="button"
          :icon="'icon-admin'"
          :title="$t('Messaging.Parameters.header')"
          name="toggleParameters"
          icon-height="24px"
          alt="parameters"
          @click="openParametersModal"
        />
      </li>
      <li v-if="!mq.tablet && !mq.phone">
        <IconOption
          class="button"
          :icon="require('@assets/icons/side_menu.svg')"
          :title="isMenuPanelDisplayed ? $t('Messaging.ThreadListOptions.hideMenuPanel') : $t('Messaging.ThreadListOptions.displayMenuPanel')"
          name="toggleMessagingMenu"
          icon-height="18px"
          alt="toggle menu"
          @click="toggleSideMenuPanel"
        />
      </li>
      <li v-if="!mq.tablet && !mq.phone">
        <IconOption
          class="button"
          :icon="require('@assets/icons/refresh.svg')"
          :title="$t('Messaging.ThreadListOptions.refresh')"
          name="refresh"
          icon-height="18px"
          alt="refresh"
          @click="refresh"
        />
      </li>
      <li v-if="mq.tablet || mq.phone">
        <IconOption
          class="button"
          :icon="require('@assets/icons/list.svg')"
          :title="$t('Messaging.multiSelection')"
          name="toggleMultiSelection"
          icon-height="15px"
          :alt="$t('toggle multiselection')"
          @click="toggleMultiSelection"
        />
      </li>
      <li v-if="mq.tablet || mq.phone">
        <IconOption
          v-if="selectedThreads.length > 0 && isMultiSelectionActive"
          class="button"
          :icon="require('@assets/icons/dots.svg')"
          title="options"
          name="options"
          icon-height="18px"
          :alt="$t('Messaging.unreadOnly')"
          @click.stop="displayThreadOptions"
        />
      </li>
    </ul>
  </div>

  <teleport
    v-if="isAContextMenuDisplayed && isThreadOptionsDisplayed"
    to="body"
  >
    <ContextMenu
      @choose-option="performChosenOption"
      @close="isThreadOptionsDisplayed=false"
    />
  </teleport>
</template>

<script>
import IconOption from '@components/Base/IconOption'
import ContextMenu from '@components/ContextMenu/ContextMenu'
import contextMenus from '@utils/contextMenus'
import messagingUtils from '@utils/messaging.utils'

import { MESSAGING } from '@/constants/appConstants'

export default {
  name: 'ThreadListOptions',
  components: { ContextMenu, IconOption },
  inject: ['mq'],
  data () {
    return {
      isThreadOptionsDisplayed: false
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
    displayThreadOptions (event) {
      if (!this.isAContextMenuDisplayed) {
        this.isThreadOptionsDisplayed = true
        this.$store.dispatch('contextMenu/openContextMenu',
          {
            event,
            options: contextMenus.messagingThreadsOptions
          })
      }
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'markAsRead':
          messagingUtils.markMessagesAsReadUnread(this.selectedThreads.map(t => t.mainMessageId), true)
          this.toggleMultiSelection()
          this.isThreadOptionsDisplayed = false
          break
        case 'markAsUnread':
          messagingUtils.markMessagesAsReadUnread(this.selectedThreads.map(t => t.mainMessageId), false)
          this.toggleMultiSelection()
          this.isThreadOptionsDisplayed = false
          break
        case 'delete':
          this.deleteSelectedThreads()
          this.isThreadOptionsDisplayed = false
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.$store.dispatch('contextMenu/closeMenus')
    },
    deleteSelectedThreads () {
      messagingUtils.deleteSelectedThreads().then(() => {
        this.toggleMultiSelection()
      })
    },
    refresh () {
      if (this.$route.params.messageId) {
        this.$router.push({ name: MESSAGING })
        this.$store.dispatch('messaging/setDisplayMessageFromRouting', false)
      } else {
        messagingUtils.refresh()
      }
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
}
</style>
