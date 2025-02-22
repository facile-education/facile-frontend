<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :hidden-footer="true"
    class="help-modal"
    data-test="help-modal"
    @close="closeModal"
  >
    <template #header>
      <h1 v-t="'HelpModal.helpModalTitle'" />
    </template>

    <template #body>
      <HelpTools />
      <div
        class="help-content"
        :class="{'phone': mq.phone || mq.tablet, 'tablet': mq.tablet}"
      >
        <HelpMenu
          v-if="!mq.phone && !mq.tablet"
          class="help-menu"
        />
        <MobileFloatingPanel
          v-if="mq.phone || mq.tablet"
          class="mobile-menu-panel"
          :class="{'collapsed': !isMobileMenuDisplayed}"
        >
          <HelpMenu />
        </MobileFloatingPanel>
        <HelpArticle class="help-article" />
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import HelpTools from '@components/HelpModal/HelpTools.vue'
import HelpArticle from '@components/HelpModal/HeplArticle/HelpArticle.vue'
import { defineAsyncComponent } from 'vue'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
const HelpMenu = defineAsyncComponent(() => import('@components/HelpModal/HelpMenu.vue'))
const MobileFloatingPanel = defineAsyncComponent(() => import('@components/Base/MobileFloatingPanel.vue'))

export default {
  name: 'HelpModal',
  components: { MobileFloatingPanel, HelpArticle, HelpMenu, HelpTools, WeprodeWindow },
  inject: ['mq'],
  emits: ['close'],
  computed: {
    isMobileMenuDisplayed () {
      return this.$store.state.help.isMobileMenuDisplayed
    }
  },
  created () {
    this.$store.dispatch('help/getHelpMenu', { query: '', menuEntryId: this.$route.meta.id })
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.help-modal {
  .window-body {
    overflow: hidden !important;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

h1 {
  margin: 0;
  font-size: 1em;
  line-height: 1.25em;
  text-transform: uppercase;
}

.help-content {
  flex: 1;
  position: relative;

  .help-menu {
    width: 244px;
  }

  .mobile-menu-panel {
    height: 100%;
    width: 70vw;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1;
    transition: width 0.35s ease;

    &.collapsed {
      width: 0;
    }
  }

  &.phone {
    height: calc(100% - $help-toolbar-height);
  }

  &.phone.tablet {
    display: flex;
    max-height: 60vh;
    min-height: 60vh;
  }

  &:not(.phone) {
    display: flex;
    max-height: 60vh;
    min-height: 60vh;

    .help-article {
      width: calc(100% - 244px);
    }
  }

  @media screen and (max-width: 1100px) {
    .help-menu {width: 200px;}

    &:not(.phone) {
      .help-article {
        width: calc(100% - 200px);
      }
    }
  }

  @media screen and (max-width: 930px) {
    .help-menu {width: 180px;}

    &:not(.phone) {
      .help-article {
        width: calc(100% - 180px);
      }
    }
  }
}

</style>
