<template>
  <Layout :is-allowed="true">
    <div
      class="messaging-body"
      :class="{'mobile': mq.phone || mq.tablet, 'tablet': mq.tablet}"
    >
      <Menu
        v-if="!mq.phone && !mq.tablet"
        v-show="isMenuPanelDisplayed"
        data-test="messaging-menu"
        class="menu-panel"
      />
      <Split
        v-if="(!mq.phone && ! mq.tablet)"
        ref="split"
        class="split"
        :gutter-size="1"
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
        <!-- Parameters -->
        <!--        <ParametersModal v-if="isParametersModalDisplayed" />-->
        <PreferencesModal
          v-if="isParametersModalDisplayed"
          tab="messaging"
        />
        <!-- Create message modal -->
        <CreateMessageModal v-if="isCreateMessageModalDisplayed" />
      </teleport>
    </div>
  </Layout>
</template>

<script>

import Layout from '@/router/layouts/EmptyLayout'
import Split from '@components/Split/Split'
import SplitArea from '@components/Split/SplitArea'
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
    Split,
    SplitArea,
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
    this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.params.messageId) {
          this.$store.dispatch('messaging/setDisplaySearchMessageBehaviour', true)
        } else {
          this.$store.dispatch('messaging/setDisplaySearchMessageBehaviour', false)
        }
        this.$store.dispatch('messaging/loadMessagingFolders')
      },
      // fetch the data when the view is created and the data is
      // already being observed
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
    width: 240px;
  }

  .split {
    height: 100%;
    flex: 1;
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
