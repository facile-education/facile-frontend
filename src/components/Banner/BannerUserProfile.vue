<template>
  <div class="profile">
    <button
      class="banner-profile"
      data-test="togglePopoverMenu"
      @click.stop="togglePopoverMenu"
    >
      <span class="thumbnail-container">
        <UserPicture
          :user="user"
          :color-reversed="true"
        />
        <Pellet
          v-if="hasNotifications"
          class="pellet theme-border-color"
        />
      </span>

      <span
        v-if="mq.desktop"
        class="username"
      >
        {{ userName }}
      </span>
      <CustomIcon
        v-if="mq.desktop"
        :icon-name="'icon-chevron-right-s'"
      />
    </button>
    <BannerPopoverMenu
      v-if="isPopoverMenuDisplayed"
      @close="isPopoverMenuDisplayed=false"
    />
  </div>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'
import UserPicture from '@components/Base/UserPicture.vue'
import { defineAsyncComponent } from 'vue'
const BannerPopoverMenu = defineAsyncComponent(() => import('@/components/Banner/BannerPopoverMenu'))
const Pellet = defineAsyncComponent(() => import('@components/Base/Pellet.vue'))

export default {
  name: 'BannerUserProfile',
  components: {
    CustomIcon,
    UserPicture,
    Pellet,
    BannerPopoverMenu
  },
  inject: ['mq'],
  data () {
    return {
      isPopoverMenuDisplayed: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userName () {
      return this.user.firstName + ' ' + this.user.lastName
    },
    hasNotifications () {
      return !this.user.hasReadLastVersionNote
    }
  },
  methods: {
    togglePopoverMenu () {
      this.$store.dispatch('menu/closeMobileMenu')
      this.isPopoverMenuDisplayed = !this.isPopoverMenuDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.profile {
  position: relative;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
}

.banner-profile {
  display: flex;
  align-items: center;
  border-left: 1px solid #fff8;
  padding: 0 1rem;
  height: 32px;
}

.thumbnail-container {
  height: 100%;
  position: relative;

  .pellet {
    position: absolute;
    right: -2px;
    top: -3px;
    background-color: white;
    border: 2px solid;
    height: 12px;
    width: 12px;
  }
}

.username {
  margin-left: 8px;
  @extend %font-regular-m;
}

.icon-chevron-right-s {
  font-size: 22px;
  margin-left: 1rem;
  transform: rotate(90deg);
}
</style>
