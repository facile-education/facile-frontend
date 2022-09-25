<template>
  <div class="messaging-body">
    <Menu
      v-show="isMenuPanelDisplayed"
      data-test="messaging-menu"
      class="menu-panel"
    />
    <Split
      ref="split"
      class="split"
    >
      <SplitArea
        data-test="threads-panel"
        :size="44.7"
        :min-size="475"
      >
        <ThreadList />
      </SplitArea>
      <SplitArea
        data-test="messages-panel"
        :size="55.3"
        :min-size="350"
      >
        <ThreadDetails />
      </SplitArea>
    </Split>

    <teleport to="body">
      <!-- Parameters -->
      <ParametersModal v-if="isParametersModalDisplayed" />
      <!-- Create message modal -->
      <CreateMessageModal v-if="isCreateMessageModalDisplayed" />
      <WarningModal v-if="isWarningModalDisplayed" />
    </teleport>
  </div>
</template>

<script>

import Split from '@components/Split/Split'
import SplitArea from '@components/Split/SplitArea'
import Menu from '@components/Messaging/Menu'
import ThreadList from '@components/Messaging/ThreadList'
import ThreadDetails from '@components/Messaging/ThreadDetails'
import ParametersModal from '@components/Messaging/ParametersModal'
import CreateMessageModal from '@components/Messaging/CreateMessageModal'
import WarningModal from '@components/Nero/WarningModal'
import configurationService from '@/api/messaging/configuration.service'
import messagingUtils from '@/utils/messaging.utils'

export default {
  name: 'Messaging',
  components: {
    Split,
    SplitArea,
    Menu,
    ThreadList,
    ThreadDetails,
    ParametersModal,
    CreateMessageModal,
    WarningModal
  },
  computed: {
    isMenuPanelDisplayed () {
      return this.$store.state.messaging.isMenuPanelDisplayed
    },
    isParametersModalDisplayed () {
      return this.$store.state.messaging.isParametersModalDisplayed
    },
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    },
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    // window.removeEventListener('keydown', this.keyMonitor)
  },
  created () {
    this.loadFolders()
    this.getSignature()
  },
  methods: {
    loadFolders () {
      this.$store.dispatch('messaging/loadMessagingFolders')
    },
    // keyboard shortcuts management
    keyMonitor: function (event) {
      // Ctrl-A for 'All' selection
      if (event.ctrlKey && ((event.key === 'a') || (event.key === 'A'))) {
        event.preventDefault()
        // this.selectAllFiles()
      } else if (event.ctrlKey && ((event.key === 'ArrowDown') || (event.key === 'ArrowUp'))) {
        // Ctrl-arrow for multi-selection
        // utils.selectCtrlDocument(this.$store, this.allSortedDocuments, this.$store.state.files.lastSelectedFile, event)
      } else if (event.key === 'Delete') {
        if (this.$store.state.messaging.selectedMessages.length > 0) {
          messagingUtils.deleteSelectedMessage()
        } else if (this.$store.state.messaging.selectedThreads.length > 0) {
          messagingUtils.deleteSelectedThreads()
        }
      } else if ((event.key === 'ArrowDown') || (event.key === 'ArrowUp')) {
        // Arrows
        // utils.selectDocument(this.$store, this.allSortedDocuments, this.selectedFiles, event)
      }
    },
    getSignature () {
      configurationService.getMessagingConfiguration().then((data) => {
        if (data.success) {
          this.$store.dispatch('messaging/setSignature', data.configuration.signature.content)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.messaging-body {
    height: calc(100% - 64px);
    display: flex;

    .menu-panel {
        width: 240px;
    }

    .split {
        height: 100%;
        flex: 1;
    }
}
</style>
