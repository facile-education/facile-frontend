<template>
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
  <div
    v-else
    class="nero"
    :class="neroClasses"
  >
    <header class="nero-header theme-background-color">
      <Banner />
    </header>
    <QuickSearchPanel
      class="quick-search-panel"
      :class="{'collapsed': !isQuickSearchDisplayed}"
    />
    <section
      v-if="!mq.phone"
      class="nero-menu"
    >
      <SideMenu />
    </section>
    <Transition name="fade">
      <MobileMenu v-if="isMobileMenuDisplayed" />
    </Transition>
    <section
      class="nero-body"
    >
      <slot />
    </section>

    <!--div
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

    <teleport
      v-for="(file, index) in openFiles"
      :key="index"
      to="body"
    >
      <FileDisplayModal
        :file="file"
        @close="closeFile(file)"
      />
    </teleport-->

    <teleport
      v-if="isWarningModalDisplayed"
      to="body"
    >
      <WarningModal
        win-width="500px"
      />
    </teleport>

    <teleport
      v-if="isHelpModalDisplayed"
      to="body"
    >
      <HelpModal
        v-if="isHelpModalDisplayed"
        @close="closeHelpModal"
      />
    </teleport>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
// import { popupDurationTime } from '@/constants/appConstants'
import Banner from '@/components/Banner/Banner'
import QuickSearchPanel from '@components/Search/QuickSearchPanel.vue'
// import Popup from '@components/Base/Popup'

// const FileDisplayModal = defineAsyncComponent(() => import('@/components/Documents/FileDisplay/FileDisplayModal'))
const MobileMenu = defineAsyncComponent(() => import('@/components/Menu/MobileMenu'))
const SideMenu = defineAsyncComponent(() => import('@/components/Menu/SideMenu'))
const HelpModal = defineAsyncComponent(() => import('@components/HelpModal/HelpModal.vue'))
const WarningModal = defineAsyncComponent(() => import('@/components/Nero/WarningModal'))

export default {
  name: 'BannerLayout',
  components: { QuickSearchPanel, HelpModal, Banner, MobileMenu, /* FileDisplayModal, Popup, */ SideMenu, WarningModal },
  inject: ['mq'],
  props: {
    isAllowed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    },
    isMobileMenuDisplayed () {
      return this.$store.state.nero.isMobileMenuDisplayed
    },
    isHelpModalDisplayed () {
      return this.$store.state.help.isHelpModalDisplayed
    },
    isQuickSearchDisplayed () {
      return this.$store.state.search.isHistoryOpen || this.$store.state.search.isQuickSearchResultDisplayed
    },
    menuExpanded () {
      return this.$store.state.nero.menuExpanded
    },
    neroClasses () {
      return {
        // 'sm': (this.mq.phone || (this.menuExpanded && this.mq.tablet)),
        // 'md': (!this.menuExpanded && this.$device.tablet),
        // 'lg': this.mq.desktop,
        mobile: this.mq.phone,
        'menu-expanded': (this.menuExpanded && !this.mq.phone),
        'menu-shrinked': (!this.menuExpanded && !this.mq.phone)
      }
    },
    /* openFiles () {
      return this.$store.state.documents.openFiles
    },
    isWarningModalDisplayed () {
      return this.$store.getters['warningModal/isWarningModalDisplayed']
    },
    popupTimeout () {
      return popupDurationTime
    },
    popupList () {
      return this.$store.state.popups.currentPopupList
    }, */
    user () {
      return this.$store.state.user
    },
    userId () {
      return this.user.userId
    }
  },
  created () {
    if (this.userId === undefined) {
      this.$store.dispatch('user/initUserInformations')
    }
    if (this.$store.state.nero.menu === undefined) {
      this.$store.dispatch('nero/initUserMenu')
    }
  },
  methods: {
    closeFile (file) {
      this.$store.dispatch('documents/closeFile', file)
    },
    closePopup () {
      this.$store.dispatch('popups/popPopup')
    },
    closeHelpModal () {
      this.$store.dispatch('help/closeHelpModal')
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
  }
}

.quick-search-panel {
  position: absolute;
  background-color: white;
  box-shadow: 0 0 14px 0 rgba(0,0,0,0.15);
  top: $banner-height;
  left: 0;
  height: calc(100% - $banner-height);
  width: 441px;
  transition: width 0.35s ease;
  z-index: $quick-search-z-index;

  &.collapsed {
    width: 0;
  }
}

.nero-header {
  grid-column: span 2;
  border: 0;
  padding: 6px 10px;
  top: 0;
  z-index: $banner-z-index;
}

.nero-body {
  height: 100%;
  overflow: auto;
  padding: 10px;
}

/* .popups-container {
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

.msg {
  text-align: center;
} */
</style>
