<template>
  <ServicesWrapper
    :is-title-visible="true"
    :title="$t('Messaging.serviceTitle')"
  >
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
          <MessagingMenu
            data-test="messaging-menu"
            class="menu-panel"
            :class="{'menu-collapsed': !isMenuPanelDisplayed}"
            :is-displayed="isMenuPanelDisplayed"
          />

          <ThreadList class="thread-list" />
        </div>

        <ThreadDetails class="thread-details" />
      </div>

      <div v-else>
        <ThreadList
          v-touch:drag="onDrag"
          v-touch:release="onDragLeave"
          v-touch:press="onDragStart"
          :is-dragging="isDragAuthorized"
        />
        <Transition name="slide-details">
          <ThreadDetails
            v-if="isMobileDetailsPanelDisplayed"
            class="thread-display"
          />
        </Transition>
        <Transition
          name="slide-menu"
        >
          <MessagingMenu
            data-test="messaging-menu"
            class="menu-panel"
            :style="`transform: translateX(${menuPosition});`"
          />
        </Transition>

        <WeprodeButton
          v-if="!isMobileDetailsPanelDisplayed"
          class="create-button"
          data-test="createMessageButton"
          :title="$t('Messaging.new')"
          @click="createNewMessage"
        >
          <CustomIcon icon-name="icon-plus" />
        </WeprodeButton>
      </div>

      <teleport to="body">
        <PreferencesModal
          v-if="isParametersModalDisplayed"
          tab="messaging"
        />
        <CreateMessageModal v-if="isCreateMessageModalDisplayed" />
      </teleport>
    </div>
  </ServicesWrapper>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import MessagingMenu from '@components/Messaging/MessagingMenu.vue'
import ThreadDetails from '@components/Messaging/ThreadDetails'
import ThreadList from '@components/Messaging/ThreadList'
import { defineAsyncComponent } from 'vue'

import configurationService from '@/api/messaging/configuration.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import messagingUtils from '@/utils/messaging.utils'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

const CreateMessageModal = defineAsyncComponent(() => import('@components/Messaging/CreateMessageModal'))
const PreferencesModal = defineAsyncComponent(() => import('@components/Preferences/PreferencesModal'))

export default {
  name: 'Messaging',
  components: {
    WeprodeButton,
    MessagingMenu,
    ThreadList,
    ThreadDetails,
    CustomIcon,
    PreferencesModal,
    // ParametersModal,
    CreateMessageModal,
    ServicesWrapper
  },
  inject: ['mq'],
  emits: ['update:layout'],
  data: function () {
    return {
      menuPosition: 0,
      isDragAuthorized: false
    }
  },
  computed: {
    isMobileDetailsPanelDisplayed () {
      return this.$store.state.messaging.isMobileDetailsPanelDisplayed &&
        !this.$store.state.messaging.isMultiSelectionActive &&
        (this.$store.state.messaging.selectedThreads.length === 1 || this.$store.state.messaging.selectedMessages.length === 1)
    },
    isMenuPanelDisplayed () {
      return this.$store.state.messaging.isMenuPanelDisplayed
    },
    isParametersModalDisplayed () {
      return this.$store.state.messaging.isParametersModalDisplayed
    },
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    },
    isModalOpen () {
      return this.$store.state.misc.nbOpenModals > 0
    },
    isDeleteMessages () {
      return this.$store.getters['currentActions/isInProgress']('deleteMessages')
    }
  },
  watch: {
    isMenuPanelDisplayed (value) {
      if (value) {
        this.menuPosition = 100 + '%'
      } else {
        this.menuPosition = 0
      }
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  mounted () {
    window.addEventListener('keydown', this.keyMonitor)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyMonitor)
  },
  created () {
    if (this.$route.params.messageId) {
      this.$store.dispatch('messaging/setDisplayMessageFromRouting', true)
    }
    this.getSignature()
    this.$store.dispatch('messaging/loadMessagingFolders').then(() => {
      this.$watch(
        () => this.$route.params,
        () => {
          if (this.$route.params.messageId) {
            this.$store.dispatch('messaging/getMessageThread', this.$route.params.messageId)
            this.$store.dispatch('messaging/showDetailPanel')

            if (this.$route.params.fileId && this.$route.params.display) {
              this.$store.dispatch('documents/openFile', { id: this.$route.params.fileId, name: this.$route.params.fileName })
            }
          } else {
            this.$store.dispatch('messaging/setDisplayMessageFromRouting', false)
          }
        },
        { immediate: true }
      )
    })
  },
  methods: {
    // keyboard shortcuts management
    keyMonitor: function (event) {
      if (!this.isModalOpen && event.key === 'Delete' && !this.isDeleteMessages) {
        if (this.$store.state.messaging.selectedMessages.length > 0) {
          messagingUtils.deleteSelectedMessage()
        } else if (this.$store.state.messaging.selectedThreads.length > 0) {
          messagingUtils.deleteSelectedThreads()
        }
      }
    },
    createNewMessage () {
      messagingUtils.newMessage()
    },
    getSignature () {
      configurationService.getMessagingConfiguration().then((data) => {
        if (data.success && data.configuration.signature.isActive) {
          this.$store.dispatch('messaging/setSignature', data.configuration.signature.content)
        }
      })
    },
    onDragStart (event) {
      if (event.touches[0].clientX < 20) {
        this.isDragAuthorized = true
      }
    },
    onDrag (event) {
      if (this.isDragAuthorized) {
        this.menuPosition = event.touches[0].clientX + 'px'
      }
    },
    onDragLeave (event) {
      if (this.isDragAuthorized) {
        if (event.changedTouches[0].clientX > 200) {
          this.menuPosition = 100 + '%'
          this.$store.dispatch('messaging/toggleSideMenuPanel')
        } else {
          this.menuPosition = 0
        }
        this.isDragAuthorized = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.messaging-body {
  height: 100%;
  display: flex;
  position: relative;
  --menu-min-width: 240px;
  --thread-list-min-width: 358px;
  --thread-details-min-width: 300px;

  .create-button {
    position: absolute;
    bottom: 14px;
    right: 14px;
    @extend %create-button;
    border-radius: 100%;
    border: 3px solid $neutral-10;
  }

  .menu-panel {
    min-width: var(--menu-min-width);
    width: var(--menu-min-width);
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
      min-width: var(--thread-list-min-width);
      max-width: 600px;
      width: 50%;
      display: flex;

      &.menu-displayed {
        min-width: calc(var(--menu-min-width) + var(--thread-list-min-width));
        max-width: 700px;
      }
    }

    .thread-list {
      min-width: var(--thread-list-min-width);
      flex: 1;
    }

    .thread-details {
      flex: 1;
      min-width: var(--thread-details-min-width);
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
      width: calc(100vw - 20px);
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
      left: -100%;
      top: 0;
      width: 100%;
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
