<template>
  <PentilaSpinner v-if="userId === undefined" />
  <div
    v-else
    class="nero"
    :class="neroClasses"
  >
    <Banner class="nero-header theme-background-color" />

    <Menu
      v-if="!mq.phone"
      class="nero-menu"
    />
    <Transition name="fade">
      <Menu v-if="isMobileMenuDisplayed" />
    </Transition>

    <section class="nero-body">
      <NotAllowed v-if="!isAllowed && !user.isAdministrator" />
      <slot v-else />
    </section>

    <Transition name="expand">
      <QuickSearchPanel
        v-if="isQuickSearchDisplayed"
        class="quick-search-panel"
      />
    </Transition>

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

    <CookiesAgreement
      v-if="!hasConfirmCookiesAgreement && !cookiesMustBeClosed"
      @close="cookiesMustBeClosed=true"
    />

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
      v-if="isHelpModalDisplayed || isAccessModalDisplayed || isConflictModalDisplayed || isWarningModalDisplayed"
      to="body"
    >
      <HelpModal
        v-if="isHelpModalDisplayed"
        @close="closeHelpModal"
      />
      <AccessModal
        v-if="isAccessModalDisplayed"
        @close="closeAccessModal"
      />
      <ConflictModal
        v-if="isConflictModalDisplayed"
        win-width="500px"
      />
      <WarningModal
        v-if="isWarningModalDisplayed"
        win-width="500px"
      />
    </teleport>

    <teleport
      v-if="isSessionWarningDisplayed"
      to="body"
    >
      <SessionEndAdvertising
        :remaining-milliseconds="remainingSessionMilliseconds"
        @close="isSessionWarningDisplayed=false"
      />
    </teleport>
  </div>
</template>

<script>
import CookiesAgreement from '@components/Nero/CookiesAgreement.vue'
import SessionEndAdvertising from '@components/Nero/SessionEndAdvertising.vue'
import dayjs from 'dayjs'
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import constants from '@/api/constants'
import { popupDurationTime } from '@/constants/appConstants'

const AccessModal = defineAsyncComponent(() => import('@components/Accesses/AccessVisualization/AccessModal'))
const Banner = defineAsyncComponent(() => import('@/components/Banner/Banner'))
const ConflictModal = defineAsyncComponent(() => import('@/components/Documents/Modals/ConflictModal'))
const FileDisplayModal = defineAsyncComponent(() => import('@/components/Documents/FileDisplay/FileDisplayModal'))
const HelpModal = defineAsyncComponent(() => import('@components/HelpModal/HelpModal'))
const NotAllowed = defineAsyncComponent(() => import('@router/views/NotAllowed'))
const Popup = defineAsyncComponent(() => import('@components/Base/Popup'))
const QuickSearchPanel = defineAsyncComponent(() => import('@components/Search/QuickSearchPanel'))
const Menu = defineAsyncComponent(() => import('@/components/Menu/Menu'))
const UploadProgression = defineAsyncComponent(() => import('@components/Documents/UploadProgression'))
const WarningModal = defineAsyncComponent(() => import('@/components/Nero/WarningModal'))

export default {
  name: 'BannerLayout',
  components: {
    SessionEndAdvertising,
    CookiesAgreement,
    AccessModal,
    Banner,
    ConflictModal,
    FileDisplayModal,
    HelpModal,
    NotAllowed,
    Popup,
    QuickSearchPanel,
    Menu,
    UploadProgression,
    WarningModal
  },
  inject: ['mq'],
  props: {
    isAllowed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      cookiesMustBeClosed: false,
      interval: undefined,
      inactionTime: 0,
      isSessionWarningDisplayed: false
    }
  },
  computed: {
    isConflictModalDisplayed () {
      return this.$store.getters['conflictModal/isConflictModalDisplayed']
    },
    isMobileMenuDisplayed () {
      return this.$store.state.menu.isMobileMenuDisplayed
    },
    isHelpModalDisplayed () {
      return this.$store.state.help.isHelpModalDisplayed
    },
    isAccessModalDisplayed () {
      return this.$store.state.accessManager.isUserAccessModalOpen
    },
    isQuickSearchDisplayed () {
      return this.$store.state.search.isHistoryOpen || this.$store.state.search.isQuickSearchResultDisplayed
    },
    isLoadingProgressionDisplayed () {
      return this.$store.state.currentActions.isLoadingProgressionDisplayed
    },
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    },
    menuExpanded () {
      return this.$store.state.menu.menuExpanded
    },
    neroClasses () {
      return {
        mobile: this.mq.phone,
        'menu-expanded': (this.menuExpanded && !this.mq.phone),
        'menu-shrinked': (!this.menuExpanded && !this.mq.phone)
      }
    },
    openFiles () {
      return this.$store.state.documents.openFiles
    },
    popupTimeout () {
      return popupDurationTime
    },
    popupList () {
      return this.$store.state.popups.currentPopupList
    },
    user () {
      return this.$store.state.user
    },
    userId () {
      return this.user.userId
    },
    hasConfirmCookiesAgreement () {
      return PentilaUtils.Cookies.getCookie('cookiesAgreement') === 'true'
    },
    remainingSessionMilliseconds () {
      return this.$store.state.menu.sessionTimeout - this.inactionTime
    }
  },
  created () {
    if (this.userId === undefined) {
      this.$store.dispatch('user/initUserInformations')
    } else if (!this.user.agreedTermsOfUse) {
      this.$router.push({ name: 'AgreeTermsOfUse' })
    } else if (this.user.passwordChange) {
      this.$router.push({ name: 'PasswordChange' })
    }
    if (this.$store.state.menu.menu === undefined) {
      this.$store.dispatch('menu/initUserMenu')
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.inactionTime = dayjs() - this.$store.state.user.lastActionDate

      if (this.remainingSessionMilliseconds <= this.$store.state.menu.sessionTimeoutWarning) {
        this.isSessionWarningDisplayed = true
      }

      if (this.remainingSessionMilliseconds <= 0) {
        window.location = constants.LOGOUT_URL // Logout
      }
    }, 1000)

    window.addEventListener('storage', this.localStorageUpdated)
  },
  unmounted () {
    clearInterval(this.interval)
    window.removeEventListener('storage', this.localStorageUpdated)
  },
  methods: {
    localStorageUpdated (event) {
      // Update last action date if it was updated by another tab
      if (event.key === 'lastActionDate') {
        const lastActionDate = event.newValue
        this.$store.dispatch('user/setLastActionDate', dayjs(lastActionDate, 'YYYY/MM/DD HH:mm:ss'))
        this.isSessionWarningDisplayed = false
      }
    },
    closeFile (file) {
      this.$store.dispatch('documents/refreshCurrentFolder') // To update the displayed closed document properties (last modified date, etc...)
      this.$store.dispatch('documents/closeFile', file)
    },
    closePopup () {
      this.$store.dispatch('popups/popPopup')
    },
    closeHelpModal () {
      this.$store.dispatch('help/closeHelpModal')
    },
    closeAccessModal () {
      this.$store.dispatch('accessManager/closeAccessModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.nero {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  /* + 1 because of useless scroll appearing */
  grid-template-rows: $banner-height calc(100% - #{$banner-height + 1});
  grid-template-areas:
    "header header"
    "side   main  ";
  transition: grid-template-columns 0.3s;
  position: relative;

  &.menu-expanded {
    grid-template-columns: $open-side-menu-width calc(100% - #{$open-side-menu-width});
  }

  &.menu-shrinked {
    grid-template-columns: $side-menu-width calc(100% - #{$side-menu-width});
  }

  &.mobile {
    grid-template-columns: 100%;
    grid-template-areas:
    "header"
    "main  ";
  }
}

.nero-header {
  grid-area: header;
  border: 0;
  top: 0;
  z-index: $banner-z-index;
}

.nero-body {
  grid-area: main;
  height: 100%;
  overflow: auto;
  padding: 10px;
}

.nero-menu {
  grid-area: side;
}

.expand-enter-active, .expand-leave-active {
  transition: width .35s ease;
}

.expand-enter-from, .expand-leave-to {
  width: 0;
}

.expand-enter-to, .expand-leave-from {
  width: $quick-search-result-width;
}

.quick-search-panel {
  position: absolute;
  background-color: white;
  box-shadow: 0 0 14px 0 rgba(0,0,0,0.15);
  top: $banner-height;
  left: 0;
  height: calc(100% - $banner-height);
  max-width: $quick-search-result-width;
  z-index: $quick-search-z-index;
  white-space: nowrap;
  overflow: hidden;
}

.popups-container {
  z-index: $popup-z-index;
  position: fixed;
  top: 30px;
  right: 15px;
  flex-direction: column;

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
  background-color: white;
  z-index: $popup-z-index;
  position: absolute;
  bottom: 1px;
  right: 20px;
  flex-direction: column;
  max-width: 100%;

  .action {
    color: white;
  }

  &.phone {
    right: 50%;
    transform: translate(50%, 0);

    .action {
      width: 90vw;
      height: 50px;
    }
  }
}
</style>
