<template>
  <div>
    <div class="user-picture">
      <PentilaUserPicture
        :image-url="userPicture"
        @click="onPictureClick()"
      />
      <PentilaButton
        :title="$t('PreferencesWindow.PersonalDetails.deleteButtonTitle')"
        type="circle"
        icon="fa fa-trash"
        cls="cancel"
        @click="removePicture"
      />
    </div>
    <div class="informations">
      <div><label v-t="'PreferencesWindow.PersonalDetails.lastNameLabel'" /> {{ details.lastName }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.firstNameLabel'" /> {{ details.firstName }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.emailAddressLabel'" /> {{ details.emailAddress }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.mobilePhoneNumberLabel'" /> {{ details.mobilePhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.smsPhoneNumberLabel'" /> {{ details.smsPhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.homePhoneNumberLabel'" /> {{ details.homePhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.officePhoneNumberLabel'" /> {{ details.officePhoneNumber }}</div>
      <div><label v-t="'PreferencesWindow.PersonalDetails.addressLabel'" /> {{ details.address }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalDetails',
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
      this.$store.dispatch('nero/openImagePickerModal', { onConfirm: this.onPictureSave })
    },
    onPictureSave (imageBlob, fileName) {
      var formData = new FormData()
      formData.append('files', imageBlob, fileName + 't.png')
      this.$store.dispatch('user/saveProfilePicture', formData)
    },
    removePicture () {
      this.$store.dispatch('user/removePicture')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-picture {
  display: inline-block;
  position: relative;
}

.cancel {
  position: absolute;
  z-index: 2;
  right: 5px;
}

.informations {
  label {
    display: inline-block;
    width: 150px;
  }
}
</style>
