<template>
  <div class="profile">
    <button
      class="banner-profile"
      data-test="togglePopoverMenu"
      @click.stop="togglePopoverMenu"
    >
      <img
        class="user-picture"
        :src="userPicture"
        alt="user_picture"
      >
      <span
        v-if="mq.desktop"
        class="username"
      >
        {{ userName }}
      </span>
      <img
        v-if="mq.desktop"
        src="@/assets/icons/chevron-up-white.svg"
        alt=""
        class="chevron"
        :class="{'reverse': !isPopoverMenuDisplayed}"
      >
    </button>
    <BannerPopoverMenu
      v-if="isPopoverMenuDisplayed"
      @close="isPopoverMenuDisplayed=false"
    />
  </div>
</template>

<script>

import { defineAsyncComponent } from 'vue'
const BannerPopoverMenu = defineAsyncComponent(() => import('@/components/Banner/BannerPopoverMenu'))

export default {
  name: 'BannerUserProfile',
  components: {
    BannerPopoverMenu
  },
  inject: ['mq'],
  data () {
    return {
      isPopoverMenuDisplayed: false
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName
    },
    userPicture () {
      return this.$store.state.user.picture
    }
  },
  methods: {
    togglePopoverMenu () {
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

.user-picture {
  height: 100%;
  border-radius: 50%;
}

.username {
  margin-left: 8px;
  @extend %font-regular-m;
}

.chevron {
  width: 1rem;
  margin-left: 1rem;
  transition: transform .5s;

  //&.reverse {
    transform: rotate(-180deg);
  //}
}
</style>
