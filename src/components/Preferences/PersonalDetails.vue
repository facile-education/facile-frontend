<template>
  <div class="user-picture">
    <img
      class="picture"
      :src="userPicture"
      @click="toggleImagePicker"
    >

    <PentilaButton
      :title="$t('deleteButtonTitle')"
      type="circle"
      cls="cancel delete"
      @click="removePicture"
    >
      <NeroIcon name="trash" />
    </PentilaButton>
  </div>
  <div class="informations">
    <div><label v-t="'lastNameLabel'" /> {{ details.lastName }}</div>
    <div><label v-t="'firstNameLabel'" /> {{ details.firstName }}</div>
    <div><label v-t="'emailAddressLabel'" /> {{ details.emailAddress }}</div>
    <div><label v-t="'mobilePhoneNumberLabel'" /> {{ details.mobilePhoneNumber }}</div>
    <div><label v-t="'smsPhoneNumberLabel'" /> {{ details.smsPhoneNumber }}</div>
    <div><label v-t="'homePhoneNumberLabel'" /> {{ details.homePhoneNumber }}</div>
    <div><label v-t="'officePhoneNumberLabel'" /> {{ details.officePhoneNumber }}</div>
    <div><label v-t="'addressLabel'" /> {{ details.address }}</div>
  </div>
  <teleport to="body">
    <ImagePicker
      v-if="show"
      @save="selectImage"
      @close="toggleImagePicker"
    />
  </teleport>
</template>

<script>
import ImagePicker from '@/components/Nero/ImagePicker'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'PersonalDetails',
  components: { ImagePicker, NeroIcon },
  data () {
    return {
      show: false
    }
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
    toggleImagePicker () {
      this.show = !this.show
    },
    selectImage ({ blob, fileName }) {
      const formData = new FormData()
      formData.append('files', blob, fileName)
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

.picture {
  height: 100px;
  width: 100px;
  border-radius: 50%;
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

<i18n locale="fr">
{
  "addressLabel": "Adresse",
  "deleteButtonTitle": "Supprimer la photo de profil",
  "emailAddressLabel": "Courriel",
  "firstNameLabel": "Prénom",
  "homePhoneNumberLabel": "Téléphone maison",
  "mobilePhoneNumberLabel": "Téléphone mobile",
  "lastNameLabel": "Nom",
  "officePhoneNumberLabel": "Téléphone bureau",
  "smsPhoneNumberLabel": "Téléphone SMS"
}
</i18n>
