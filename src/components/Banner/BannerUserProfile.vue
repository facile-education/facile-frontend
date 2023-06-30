<template>
  <div
    class="profile"
    @click="togglePopoverMenu"
  >
    <img
      class="picture"
      :src="userPicture"
    >
    <div
      v-if="mq.desktop"
      class="user-infos"
    >
      <span class="username">
        {{ userName }}
      </span>
    </div>
    <BannerItem
      v-if="mq.desktop"
      icon="chevron-down"
      data-test="togglePopoverMenu"
    />
    <BannerPopoverMenu v-if="isPopoverMenuDisplayed" />
  </div>
</template>

<script>
import BannerItem from '@/components/Banner/BannerItem'
import BannerPopoverMenu from '@/components/Banner/BannerPopoverMenu'

export default {
  name: 'BannerUserProfile',
  components: {
    BannerItem,
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
      // return (this.$store.state.user.firstName.charAt() + '. ' +
      //  this.$store.state.user.lastName)
      return this.$store.state.user.firstName + ' ' + this.$store.state.user.lastName
    },
    userPicture () {
      return this.$store.state.user.picture
    }
  },
  methods: {
    setLang: function (lang) {
      // TODO
      // i18n.setLang(lang)
    },
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
  display: flex;
  border-left: 1px solid #fff8;
  padding-left: 15px;
  margin-left: 10px;
}

.picture {
  border-radius: 50px;
  width: 36px;
  height: 36px;
}

.user-infos {
  vertical-align: top;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: flex;
}

.username {
  margin: auto 10px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: .9rem;
}

.school-link {
  color: $color-light-text;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
