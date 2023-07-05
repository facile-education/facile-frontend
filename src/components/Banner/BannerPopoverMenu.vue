<template>
  <nav
    class="popover-menu"
    data-test="popover-menu"
    data-html2canvas-ignore="true"
  >
    <ul>
      <li>
        <button
          v-t="'preferences'"
          data-test="openPreferencesModal"
          @click="togglePreferencesModal"
        />
      </li>
      <li>
        <button
          v-t="'informations'"
          data-test="openInformationModal"
          @click="toggleInformationsModal"
        />
      </li>
      <li>
        <button
          v-t="'assistance'"
          data-test="openSupportModal"
          @click="toggleSupportModal"
        />
      </li>
      <li>
        <button
          v-t="'suggestion'"
          data-test="openSuggestionModal"
          @click="toggleSuggestionModal"
        />
      </li>
      <li v-if="isAdministrator">
        <!-- TODO dynamic url -->
        <a
          v-t="'controlPanel'"
          data-test="openControl_panel"
          href="/group/control_panel?doAsGroupId=11107&refererPlid=4439929"
        />
      </li>
    </ul>

    <div class="logout-container">
      <a
        :href="logoutUrl"
        class="logout-link"
        data-test="logout"
      >
        <img
          src="@/assets/icons/logout.svg"
          alt=""
        >
        <span>{{ $t('logout') }}</span>
      </a>
    </div>

    <teleport to="body">
      <InformationModal
        v-if="isInformationModalDisplayed"
        @close="toggleInformationsModal"
      />
      <PreferencesModal
        v-if="isPreferencesDisplayed"
        @close="togglePreferencesModal"
      />
      <AssistanceModal
        v-if="isSupportModalDisplayed"
        :modal-type="supportModalType"
        @close="toggleSupportModal"
      />
    </teleport>
  </nav>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import constants from '@/api/constants'

const AssistanceModal = defineAsyncComponent(() => import('@/components/Assistance/AssistanceModal.vue'))
const InformationModal = defineAsyncComponent(() => import('@/components/Informations/InformationModal.vue'))
const PreferencesModal = defineAsyncComponent(() => import('@/components/Preferences/PreferencesModal.vue'))

export default {
  name: 'BannerPopoverMenu',
  components: {
    AssistanceModal,
    InformationModal,
    PreferencesModal
  },
  emits: ['close'],
  data () {
    return {
      logoutUrl: constants.LOGOUT_URL,
      supportModalType: '',
      isInformationModalDisplayed: false,
      isPreferencesDisplayed: false,
      isSupportModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        if (!this.isInformationModalDisplayed && !this.isPreferencesDisplayed && !this.isSupportModalDisplayed) {
          this.$emit('close')
        }
      }
    },
    toggleInformationsModal () {
      this.isInformationModalDisplayed = !this.isInformationModalDisplayed
    },
    togglePreferencesModal () {
      this.isPreferencesDisplayed = !this.isPreferencesDisplayed
    },
    toggleSupportModal () {
      this.supportModalType = 'Assistance'
      this.isSupportModalDisplayed = !this.isSupportModalDisplayed
    },
    toggleSuggestionModal () {
      this.supportModalType = 'Suggestion'
      this.isSupportModalDisplayed = !this.isSupportModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.popover-menu {
  position: absolute;
  right: 4px;
  top: 46px;
  width: 240px;
  background-color: white;
  padding: 16px 0;
  z-index: $popup-z-index;
  border: 1px solid $neutral-40;
  border-radius: 4px;
  @extend %object-shadow-2;

  button {
    margin: 0;
    padding: 8px 1rem;
    background-color: transparent;
    border: none;
    cursor: pointer;

    @extend %font-regular-m;
    width: 100%;
    text-align: center;

    &:hover {
      background-color: $color-hover-bg;
    }
  }

  .logout-container {
    padding: 1rem 1rem 0 1rem;
  }

  a.logout-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 6px 6px;
    color: white;
    text-decoration: none;
    background-color: $color-logout-button;
    border-radius: 6px;

    &:hover {
      text-decoration: underline;
    }

    span {
      padding: 0 8px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "assistance": "Assistance",
  "controlPanel": "Panneau de contrôle",
  "informations": "Informations",
  "logout": "Fermer la session",
  "preferences": "Préférences",
  "suggestion": "Suggestion"
}
</i18n>
