<template>
  <div>
    <div class="user-picture">
      <NeroUserPicture
        :image-url="userPicture"
        @click="onPictureClick()"
      />
      <NeroButton
        :title="$t('PreferencesWindow.PWPersonalDetails.deleteButtonTitle')"
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
    </div>
  </div>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroUserPicture from '@/components/Nero/NeroUserPicture'

export default {
  name: 'PWPersonalDetails',
  components: {
    NeroButton,
    NeroUserPicture
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
