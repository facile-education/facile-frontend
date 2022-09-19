<template>
  <div class="service-body">
    <PentilaSpinner v-if="userId === undefined" />
    <h2
      v-else-if="userId === 0"
      class="msg"
    >
      {{ $t('Layout.authRequired') }}
    </h2>
    <h2
      v-else-if="!isAllowed && !user.isAdministrator"
      class="msg"
    >
      {{ $t('Layout.notAllowed') }}
    </h2>
    <slot v-else />

    <div
      class="popups-container"
      :class="{'phone': mq.phone}"
    >
      <Popup
        v-for="(popup, index) in popupList"
        :key="index"
        class="popup"
        :type="popup.type"
        :message="popup.message"
        :timeout="popupTimeout"
        @close="closePopup"
      />
    </div>

    <div
      v-if="isLoadingProgressionDisplayed"
      class="background-actions-container"
      :class="{'phone': mq.phone}"
    >
      <UploadProgression />
    </div>

    <teleport
      v-for="(file, index) in openFiles"
      :key="index"
      to="body"
    >
      <FileDisplayModal
        :file="file"
        @close="closeFile(file)"
      />
    </teleport>

    <teleport
      v-if="isWarningModalDisplayed"
      to="body"
    >
      <WarningModal
        win-width="500px"
      />
    </teleport>

    <teleport
      v-if="isConflictModalDisplayed"
      to="body"
    >
      <ConflictModal
        win-width="500px"
      />
    </teleport>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import Popup from '@components/Base/Popup'
import { popupDurationTime } from '@/constants/appConstants'
import UploadProgression from '@components/Documents/UploadProgression'
const WarningModal = defineAsyncComponent(() => import('@/components/Nero/WarningModal'))
const ConflictModal = defineAsyncComponent(() => import('@/components/Documents/Modals/ConflictModal'))
const FileDisplayModal = defineAsyncComponent(() => import('@/components/Documents/FileDisplay/FileDisplayModal'))

export default {
  components: { UploadProgression, ConflictModal, Popup, WarningModal, FileDisplayModal },
  inject: ['mq'],
  props: {
    isAllowed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    openFiles () {
      return this.$store.state.documents.openFiles
    },
    isLoadingProgressionDisplayed () {
      return this.$store.state.currentActions.isLoadingProgressionDisplayed
    },
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    },
    isConflictModalDisplayed () {
      return this.$store.getters['conflictModal/isConflictModalDisplayed']
    },
    popupTimeout () {
      return popupDurationTime
    },
    popupList () {
      return this.$store.state.popups.currentPopupList
    },
    backgroundActionList () {
      return this.$store.state.currentActions.currentBackgroundActionList
    },
    user () {
      return this.$store.state.user
    },
    userId () {
      return this.user.userId
    }
  },
  created () {
    this.$store.dispatch('user/initUserInformations')
  },
  methods: {
    closeFile (file) {
      this.$store.dispatch('documents/refreshCurrentFolder') // To update the displayed closed document properties (last modified date, etc...)
      this.$store.dispatch('documents/closeFile', file)
    },
    closePopup () {
      this.$store.dispatch('popups/popPopup')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.service-body {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.popups-container {
  z-index: $popup-z-index;
  position: fixed;
  top: 30px;
  right: 15px;
  flex-direction: column-reverse;

  .popup {
    color: white;
  }

  &.phone {
    top: 16px;
    right: 50%;
    transform: translate(50%, 0);

    .popup {
      width: 90vw;
      height: 50px;
    }
  }
}

.background-actions-container {
  z-index: $popup-z-index;
  position: fixed;
  bottom: 30px;
  right: 0px;
  flex-direction: column;

  .action {
    color: white;
  }

  &.phone {
    top: 16px;
    right: 50%;
    transform: translate(50%, 0);

    .action {
      width: 90vw;
      height: 50px;
    }
  }
}

.msg {
  text-align: center;
}
</style>
