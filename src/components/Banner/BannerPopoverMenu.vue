<template>
  <ul class="popover-menu">
    <li>
      <i class="fa fa-caret-up" />
      <img
        :src="userPicture"
        alt=""
        class="picture"
      >
      <div class="user-name">
        <p>{{ userFullName }}</p>
        <a
          v-t="'Banner.BannerPopoverMenu.preferencesLabel'"
          href="#"
          @click="openPreferencesModal"
        />
      </div>
    </li>
    <li>
      <a
        href="#"
        @click="openInformationsModal"
      >
        {{ $t('Banner.BannerPopoverMenu.informationsLabel') }}<i class="fa fa-chevron-right" />
      </a>
      <a
        href="#"
        @click="openSupportModal"
      >
        {{ $t('Banner.BannerPopoverMenu.supportLabel') }}<i class="fa fa-chevron-right" />
      </a>
      <!-- TODO dynamic url -->
      <a
        v-if="isAdministrator"
        href="/group/control_panel?doAsGroupId=11107&refererPlid=4439929"
      >
        {{ $t('Banner.BannerPopoverMenu.controlPanelLabel') }}<i class="fa fa-chevron-right" />
      </a>
    </li>
    <li>
      <!-- TODO dynamic url -->
      <a
        href="/c/portal/logout"
        class="logout"
        title="Déconnexion"
      >
        <i class="fa fa-sign-out-alt" /> {{ $t('Banner.BannerPopoverMenu.logoutButtonLabel') }}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BannerPopoverMenu',
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
    openPreferencesModal () {
      this.$store.dispatch('nero/openPreferencesModal')
    },
    openInformationsModal () {
      this.$store.dispatch('nero/openInformationModal')
    },
    openSupportModal () {
      console.log('TODO open support modal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

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
  background-color: $background-white-color;
  position: absolute;
  left: 0;
  top: 46px;
  z-index: $popup-z-index;
  border-radius: $border-radius;
  @extend %nero-shadow;

  li {
    display: block;
    border-bottom: solid 1px $text-color-menu;
    padding: 7px;
  }

  a {
    display: block;
    padding: 2px;
    color: $text-color-menu;
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
  // 50px = padding (14px) + img (36px)
  @include calc(width, '100% - 50px');

  p {
    color: $text-color;
  }
}

.fa-chevron-right {
  float: right;
}

a.logout {
  padding: 6px 0;
  border-radius: $border-radius;
  color: $text-color-light;
  text-align: center;
  text-decoration: none;
  background-color: $notif-background-color;//#cd4436;
}
</style>
