<template>
  <nav
    class="popover-menu"
    data-test="popover-menu"
    data-html2canvas-ignore="true"
  >
  <ul>
    <li>
        <span class="username">{{ firstName }}</span>
        <button
          v-t="'preferences'"
          data-test="openPreferencesModal"
          @click="togglePreferencesModal"
        />
      </li>
      <li
        class="top" 
        style="position: relative"
      >
        <button
          v-t="'news'"
          data-test="openVersionNotesModal"
          @click="toggleVersionNotesModal"
        />
        <Pellet
          v-if="!hasReadLastVersionNote"
          class="pellet"
        />
      </li>
      <li>
        <button
          v-t="'informations'"
          data-test="openInformationModal"
          @click="toggleInformationsModal"
        />
      </li>
      <li class="top">
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
      <li
        v-if="isAdministrator"
        class="top"
      >
        <a
          v-t="'controlPanel'"
          data-test="openControl_panel"
          href="/lfr"
        />
      </li>
    </ul>

    <div class="logout-container">
      <a
        class="logout-link"
        data-test="logout"
        @click="doLogout"
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
      <VersionNotesModal
        v-if="isVersionNotesModalDisplayed"
        @close="toggleVersionNotesModal"
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
const VersionNotesModal = defineAsyncComponent(() => import('@components/VersionNotes/VersionNotesModal.vue'))
const Pellet = defineAsyncComponent(() => import('@components/Base/Pellet.vue'))

export default {
  name: 'BannerPopoverMenu',
  components: {
    Pellet,
    VersionNotesModal,
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
      isSupportModalDisplayed: false,
      isVersionNotesModalDisplayed: false
    }
  },
  computed: {
    firstName () {
      return this.$store.state.user.firstName
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    hasReadLastVersionNote () {
      return this.$store.state.user.hasReadLastVersionNote
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
        if (!this.isInformationModalDisplayed && !this.isPreferencesDisplayed && !this.isSupportModalDisplayed && !this.isVersionNotesModalDisplayed) {
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
    toggleVersionNotesModal () {
      this.isVersionNotesModalDisplayed = !this.isVersionNotesModalDisplayed
    },
    toggleSupportModal () {
      this.supportModalType = 'Assistance'
      this.isSupportModalDisplayed = !this.isSupportModalDisplayed
    },
    toggleSuggestionModal () {
      this.supportModalType = 'Suggestion'
      this.isSupportModalDisplayed = !this.isSupportModalDisplayed
    },
    doLogout () {
      window.location.href = this.logoutUrl
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

.top {
  border-top: 1px solid $color-border-menu;
}

.popover-menu {
  position: absolute;
  right: 4px;
  top: 46px;
  width: 220px;
  background-color: white;
  padding: 16px 0;
  z-index: $popup-z-index;
  border: 1px solid $neutral-40;
  border-radius: 4px;
  @extend %object-shadow-2;

  button, a {
    display: inline-block;
    margin: 0;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: initial;
    text-decoration: none;
    text-align: left;

    @extend %font-regular-m;
    width: 100%;

    &:hover {
      background-color: $color-hover-bg;
    }
  }
}

.pellet {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
}

.username {
  display: block;
  margin: 0 1rem;
  color: $neutral-80;
  @extend %font-bold-l;
}

.logout-container {
  padding: 0 1rem;
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
    background-color: $color-logout-button;
  }

  span {
    padding: 0 8px;
  }
}

</style>

<i18n locale="fr">
{
  "assistance": "Assistance",
  "controlPanel": "Panneau de contrôle",
  "informations": "Informations",
  "logout": "Fermer la session",
  "news": "Nouveautés",
  "preferences": "Préférences",
  "suggestion": "Suggestion"
}
</i18n>
