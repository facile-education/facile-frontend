<template>
  <PentilaWindow
    :modal="true"
    :full-screen="mq.phone"
    :hidden-footer="true"
    data-test="help-modal"
    @close="closeModal"
  >
    <template #header>
      <h1 v-t="'helpModalTitle'" />
    </template>

    <template #body>
      <HelpTools />
      <div
        class="help-content"
        :class="{'phone': mq.phone}"
      >
        <HelpMenu
          v-if="!mq.phone"
          class="help-menu"
        />
        <MobileFloatingPanel
          v-if="mq.phone && isMobileMenuDisplayed"
          class="mobile-menu-panel"
        >
          <HelpMenu />
        </MobileFloatingPanel>
        <HelpArticle class="help-article" />
      </div>
    </template>
  </pentilawindow>
</template>

<script>
import HelpTools from '@components/HelpModal/HelpTools.vue'
import HelpMenu from '@components/HelpModal/HelpMenu.vue'
import HelpArticle from '@components/HelpModal/HeplArticle/HelpArticle.vue'
import MobileFloatingPanel from '@components/Base/MobileFloatingPanel.vue'

export default {
  name: 'HelpModal',
  components: { MobileFloatingPanel, HelpArticle, HelpMenu, HelpTools },
  inject: ['mq'],
  emits: ['close'],
  computed: {
    isMobileMenuDisplayed () {
      return this.$store.state.help.isMobileMenuDisplayed
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.$store.dispatch('help/getHelpMenu', { query: '', itemIdToSelect: 'default' })
  },
  methods: {
    closeModal () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
  font-size: 1em;
  line-height: 1.25em;
  text-transform: uppercase;
}

.help-content {
  width: 100%;
  height: 100%;
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
  }

  &:not(.phone) {
    display: flex;
    max-height: 60vh;
    min-height: 60vh;

    .help-article {
      width: calc(100% - 244px);
    }
  }
}

</style>

<i18n locale="fr">
{
  "helpModalTitle": "Service d'aide"
}
</i18n>
