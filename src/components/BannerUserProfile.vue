<template>
  <div class="profile">
    <img
      class="picture"
      src="../assets/logo.png"
      @click="setLang('en')">
    <div class="user-infos">
      <p class="username">
        {{ userName }}
      </p>
      <a
        :title="schoolName"
        href="https://google.fr"
        class="school-link"
        target="_blank">
        {{ schoolName }}
      </a>
    </div>
    <BannerItem/>
  </div>
</template>

<script>
import BannerItem from '@/components/BannerItem'
import i18n from '@/lang/lang'

export default {
  name: 'BannerUserProfile',
  components: {
    BannerItem
  },
  computed: {
    userName () {
      return (this.$store.state.currentUser.firstName.charAt() + '. ' +
        this.$store.state.currentUser.lastName).toUpperCase()
    },
    userPicture () {
      return this.$store.state.currentUser.picture
    },
    schoolName () {
      return this.$store.state.schools[0].name
    }
  },
  methods: {
    setLang: function (lang) {
      i18n.setLang(lang)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.profile {
  display: inline-block;
}

.picture {
  display: inline-block;
  border-radius: 50px;
  width: 36px;
  height: 36px;
}

.user-infos {
  display: inline-block;
  width: 125px;
  font-size: 11px;
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
