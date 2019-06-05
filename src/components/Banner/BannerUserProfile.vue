<template>
  <div class="profile">
    <!-- TODO remove setLang example -->
    <img
      class="picture"
      :src="userPicture"
      @click="setLang('en')"
    >
    <div
      v-if="$device.desktop"
      class="user-infos"
    >
      <p class="username">
        {{ userName }}
      </p>
      <a
        v-if="homeSchool"
        :title="homeSchool.name"
        :href="homeSchool.link"
        class="school-link"
        target="_blank"
      >
        {{ homeSchool.name }}
      </a>
    </div>
    <BannerItem
      v-if="$device.desktop"
      icon="fa fa-chevron-down"
      data-test="togglePopoverMenu"
      @click="togglePopoverMenu"
    />
    <BannerPopoverMenu v-if="isPopoverMenuDisplayed" />
  </div>
</template>

<script>
import BannerItem from '@/components/Banner/BannerItem'
import BannerPopoverMenu from '@/components/Banner/BannerPopoverMenu'
import i18n from '@/lang/lang'

export default {
  name: 'BannerUserProfile',
  components: {
    BannerItem,
    BannerPopoverMenu
  },
  data () {
    return {
      isPopoverMenuDisplayed: false
    }
  },
  computed: {
    userName () {
      return (this.$store.state.user.firstName.charAt() + '. ' +
        this.$store.state.user.lastName)
    },
    userPicture () {
      return this.$store.state.user.picture
    },
    homeSchool () {
      return this.$store.getters['user/homeSchool']
    }
  },
  methods: {
    setLang: function (lang) {
      i18n.setLang(lang)
    },
    togglePopoverMenu () {
      this.isPopoverMenuDisplayed = !this.isPopoverMenuDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.profile {
  position: relative;
  display: flex;
}

.picture {
  border-radius: 50px;
  width: 36px;
  height: 36px;
}

.user-infos {
  width: 125px;
  font-size: 12px;
  padding-left: 2px;
  vertical-align: top;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.username {
  margin: 0;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.school-link {
  color: $text-color-light;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
