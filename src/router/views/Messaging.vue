<template>
  <Layout :is-allowed="true">
    <div
      class="messaging-body"
      :class="{'mobile': mq.phone || mq.tablet, 'tablet': mq.tablet}"
    >
      <div
        v-if="!mq.phone && !mq.tablet"
        class="desktop-display"
      >
        <div
          class="left"
          :class="{'menu-displayed': isMenuPanelDisplayed}"
        >
          <Menu
            data-test="messaging-menu"
            class="menu-panel"
            :class="{'menu-collapsed': !isMenuPanelDisplayed}"
          />

          <ThreadList class="thread-list" />
        </div>

        <ThreadDetails class="thread-details" />
      </div>

      <div v-else>
        <ThreadList />
        <Transition name="slide-details">
          <ThreadDetails
            v-if="isMobileDetailsPanelDisplayed"
            class="thread-display"
          />
        </Transition>
        <Transition name="slide-menu">
          <Menu
            v-show="isMenuPanelDisplayed"
            data-test="messaging-menu"
            class="menu-panel"
          />
        </Transition>
      </div>

      <teleport to="body">
        <PreferencesModal
          v-if="isParametersModalDisplayed"
          tab="messaging"
        />
        <CreateMessageModal v-if="isCreateMessageModalDisplayed" />
      </teleport>
    </div>
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/EmptyLayout'
import Menu from '@components/Messaging/Menu'
import ThreadList from '@components/Messaging/ThreadList'
import ThreadDetails from '@components/Messaging/ThreadDetails'
import configurationService from '@/api/messaging/configuration.service'
import messagingUtils from '@/utils/messaging.utils'
import { defineAsyncComponent } from 'vue'
const CreateMessageModal = defineAsyncComponent(() => import('@components/Messaging/CreateMessageModal'))
const PreferencesModal = defineAsyncComponent(() => import('@components/Preferences/PreferencesModal'))

export default {
  name: 'Messaging',
  components: {
    Layout,
    Menu,
    ThreadList,
    ThreadDetails,
    PreferencesModal,
    // ParametersModal,
    CreateMessageModal
  },
  inject: ['mq'],
  computed: {
    isMobileDetailsPanelDisplayed () {
      return this.$store.state.messaging.isMobileDetailsPanelDisplayed &&
        !this.$store.state.messaging.isMultiSelectionActive &&
        this.$store.state.messaging.selectedThreads.length === 1
    },
    isMenuPanelDisplayed () {
      return this.$store.state.messaging.isMenuPanelDisplayed
    },
    isParametersModalDisplayed () {
      return this.$store.state.messaging.isParametersModalDisplayed
    },
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    // window.removeEventListener('keydown', this.keyMonitor)
  },
  created () {
    this.getSignature()
    this.$store.dispatch('messaging/loadMessagingFolders')
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.params.messageId) {
          this.$store.dispatch('messaging/setDisplayMessageFromRouting', true)
          if (this.$route.params.fileId && this.$route.params.display) {
            this.$store.dispatch('documents/openFile', { id: this.$route.params.fileId, name: this.$route.params.fileName })
          }
        } else {
          this.$store.dispatch('messaging/setDisplayMessageFromRouting', false)
        }
      },
      { immediate: true }
    )
  },
  methods: {
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
  height: 100%;
  display: flex;

  .menu-panel {
    min-width: 240px;
    width: 240px;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
    transition: all .3s ease;

    &.menu-collapsed {
      min-width: 0;
      width: 0;
    }
  }

  .desktop-display {
    width: 100%;
    display: flex;

    .left {
      height: 100%;
      max-width: 600px;
      flex: 1;
      display: flex;

      &.menu-displayed {
        max-width: 700px;
      }
    }

    .thread-list {
      min-width: 358px;
      flex: 1;
    }

    .thread-details {
      flex: 1;
      min-width: 300px;
    }

    .thread-list, .thread-details {
      height: 100%;
    }
  }

  &.mobile {
    position: relative;
    overflow: hidden;
    height: 100%;

    .panel {
      width: 100vw;
    }

    .thread-display {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
    }

    .menu-panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100%;
    }

    .slide-menu-enter-active {
      transition: all .3s ease-in;
    }
    .slide-menu-leave-active {
      transition: all .3s ease-in;
    }
    .slide-menu-enter-from, .slide-menu-leave-to
      /* .slide-fade-leave-active below version 2.1.8 */ {
      transform: translateX(-100%);
    }

    .slide-details-enter-active {
      transition: all .3s ease-in;
    }
    .slide-details-leave-active {
      transition: all .3s ease-in;
    }
    .slide-details-enter-from, .slide-details-leave-to {
      transform: translateX(100%);
    }
  }

  &.tablet {
    height: 100%;
    .panel {
      height: 100%;
    }
  }
}
</style>
