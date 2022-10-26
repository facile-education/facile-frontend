<template>
  <ul
    class="popover-menu"
    data-test="popover-menu"
    data-html2canvas-ignore="true"
  >
    <li>
      <NeroIcon name="caret-up" />
      <img
        :src="userPicture"
        alt=""
        class="picture"
      >
      <div
        class="user-name"
        data-test="user-name"
      >
        <span>{{ userFullName }}</span>
        <a
          v-t="'preferences'"
          data-test="openPreferencesModal"
          href="#"
          @click="togglePreferencesModal"
        />
      </div>
    </li>
    <li>
      <a
        href="#"
        data-test="openInformationModal"
        @click="toggleInformationsModal"
      >
        {{ $t('informations') }}<NeroIcon name="chevron-right" />
      </a>
      <a
        href="#"
        data-test="openSupportModal"
        @click="toggleSupportModal"
      >
        {{ $t('assistance') }}<NeroIcon name="chevron-right" />
      </a>
      <a
        href="#"
        data-test="openSupportModal"
        @click="toggleSupportModal"
      >
        {{ $t('suggestion') }}<NeroIcon name="chevron-right" />
      </a>
      <!-- TODO dynamic url -->
      <a
        v-if="isAdministrator"
        data-test="openControl_panel"
        href="/group/control_panel?doAsGroupId=11107&refererPlid=4439929"
      >
        {{ $t('controlPanel') }}<NeroIcon name="chevron-right" />
      </a>
    </li>
    <li>
      <!-- TODO dynamic url -->
      <a
        href="/c/portal/logout"
        class="logout"
        data-test="logout"
        title="Déconnexion"
      >
        <NeroIcon name="sign-out-alt" /> {{ $t('logout') }}
      </a>
    </li>
  </ul>
  <teleport to="body">
    <InformationModal
      v-if="isInformationsModalDisplayed"
      @close="toggleInformationsModal"
    />
    <PreferencesModal
      v-if="isPreferencesDisplayed"
      @close="togglePreferencesModal"
    />
    <AssistanceModal
      v-if="isSupportModalDisplayed"
      @close="toggleSupportModal"
    />
  </teleport>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import NeroIcon from '@/components/Nero/NeroIcon'

const AssistanceModal = defineAsyncComponent(() => import('@/components/Assistance/AssistanceModal.vue'))
const InformationModal = defineAsyncComponent(() => import('@/components/Informations/InformationModal.vue'))
const PreferencesModal = defineAsyncComponent(() => import('@/components/Preferences/PreferencesModal.vue'))

export default {
  name: 'BannerPopoverMenu',
  components: {
    AssistanceModal,
    InformationModal,
    NeroIcon,
    PreferencesModal
  },
  data () {
    return {
      isInformationsModalDisplayed: false,
      isPreferencesDisplayed: false,
      isSupportModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    userFullName () {
      return (this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName)
    },
    userPicture () {
      return this.$store.state.user.picture
    }
  },
  methods: {
    toggleInformationsModal () {
      this.isInformationsModalDisplayed = !this.isInformationsModalDisplayed
    },
    togglePreferencesModal () {
      this.isPreferencesDisplayed = !this.isPreferencesDisplayed
    },
    toggleSupportModal () {
      this.isSupportModalDisplayed = !this.isSupportModalDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.fa-caret-up {
  position: absolute;
  top: -20px;
  left: 8px;
  color: #fff;
  font-size: 2em;
}

.popover-menu {
  margin: 0;
  padding: 0;
  background-color: $color-white-bg;
  position: absolute;
  left: 0;
  top: 46px;
  z-index: $popup-z-index;
  border-radius: $border-radius;
  @extend %object-shadow;

  li {
    display: block;
    border-bottom: solid 1px $color-menu-text;
    padding: 7px;
  }

  a {
    display: block;
    padding: 2px;
    color: $color-menu-text;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.picture {
  display: inline-block;
  border-radius: 50px;
  width: 50px;
  height: 50px;
}

.user-name {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
  // 55px = padding (14px) + img (36px) + margin (5px)
  @include calc(width, '100% - 55px');

  span {
    color: $color-text;
  }
}

.fa-chevron-right {
  float: right;
}

a.logout {
  padding: 6px 0;
  border-radius: $border-radius;
  color: $color-light-text;
  text-align: center;
  text-decoration: none;
  background-color: $color-notif-bg;
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
