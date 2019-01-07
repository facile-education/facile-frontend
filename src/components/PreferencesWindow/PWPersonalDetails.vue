<template>
  <div>
    <div class="user-picture">
      <img
        class="picture"
        :src="userPicture"
        @click="onPictureClick()"
      >
      <div class="background theme-background-color" />
      <NeroButton
        :title="$t('TODO')"
        type="circle"
        icon="fa fa-trash"
        cls="cancel"
        @click="onDeletePicture"
      />
    </div>
    <div class="informations">
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.lastNameLabel'" /> {{ details.lastName }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.firstNameLabel'" /> {{ details.firstName }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.emailAddressLabel'" /> {{ details.emailAddress }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.mobilePhoneNumberLabel'" /> {{ details.mobilePhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.smsPhoneNumberLabel'" /> {{ details.smsPhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.homePhoneNumberLabel'" /> {{ details.homePhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.officePhoneNumberLabel'" /> {{ details.officePhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PWPersonalDetails.addressLabel'" /> {{ details.address }}</div>

      details.diffusion ?
    </div>
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'

export default {
  name: 'PWPersonalDetails',
  components: {
    NeroButton
  },
  computed: {
    details () {
      return this.$store.state.user.details
    },
    userPicture () {
      return this.$store.state.user.picture
    }
  },
  created () {
    if (this.details.lastName === undefined) {
      this.$store.dispatch('user/getPersonalDetails')
    }
  },
  methods: {
    onPictureClick () {
      this.$store.dispatch('nero/openImagePickerModal')
    },
    onDeletePicture () {
      console.log('delete picture')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-picture {
  width: 123px;
  height: 123px;
  position: relative;
}

.picture {
  height: 106px;
  width: 106px;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  margin: 3px;

  &:hover {
    cursor: pointer;
  }
}

.background {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  position: absolute;
}

.cancel {
  position: absolute;
  z-index: 2;
  right: 10px;
}

.informations {
  label {
    display: inline-block;
    width: 150px;
  }
}
</style>
