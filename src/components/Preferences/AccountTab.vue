<template>
  <div
    class="account-tab"
    data-test="account-tab"
  >
    <section class="user-picture">
      <h4 v-t="'userPicture'" />
      <div class="body">
        <div class="left-section">
          <div class="thumbnail-container">
            <UserPicture
              class="picture"
              :user="user"
              size="100px"
              tabindex="0"
              @keyup.enter="toggleImagePicker"
              @click="toggleImagePicker"
            />

            <PentilaButton
              v-if="user.picture !== ''"
              :title="$t('deleteButtonTitle')"
              type="circle"
              cls="cancel delete"
              @click="removePicture"
            >
              <img
                src="@/assets/icons/trash_white.svg"
                alt="trash"
              >
            </PentilaButton>

            <PentilaButton
              v-else
              :title="$t('addButtonTitle')"
              :aria-label="$t('addButtonTitle')"
              class="add-picture"
              type="circle"
              @click="toggleImagePicker"
            >
              <img
                src="@/assets/icons/icon_plus_white.svg"
                alt="trash"
              >
            </PentilaButton>
          </div>
        </div>

        <PentilaSpinner
          v-if="isSavingProfilePicture"
          style="z-index: 1"
        />
      </div>
    </section>
    <section class="theme-color">
      <h4 v-t="'themeColor'" />
      <ColorPicker
        class="color-picker"
        :model-value="themeColor"
        :colors="colors"
        @update:model-value="onColorChange"
      />
    </section>
    <section class="activity-report">
      <h4 v-t="'activityReport'" />
      <PentilaDropdown
        :model-value="selectedFrequency"
        :list="frequency"
        display-field="label"
        @update:model-value="onFrequencySelect"
      />
    </section>
  </div>

  <teleport to="body">
    <ImagePickerModal
      v-if="show"
      @save="selectImage"
      @close="toggleImagePicker"
    />
  </teleport>
</template>

<script>
import UserPicture from '@components/Base/UserPicture.vue'
import ColorPicker from '@components/Nero/ColorPicker'
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import userService from '@/api/user.service'
const ImagePickerModal = defineAsyncComponent(() => import('@/components/Nero/ImagePicker'))

export default {
  name: 'AccountTab',
  components: { UserPicture, ColorPicker, ImagePickerModal },
  emits: ['save'],
  data () {
    return {
      show: false,
      themeColor: '',
      // Orange: '#f4901d', Vue greens: '#42b983', '#4dba87', Light blue : '#73B2D9', Pentila : '#379FB7'
      colors: ['#99B9E9', '#E47B00', '#8E44AD', '#27AE60', '#2982B9',
        '#7F8C8D', '#16A085', '#34495E', '#E74C3C', '#F1C40F'],
      // Frequency : NONE = 0, DAILY = 1, WEEKLY = 2
      frequency: [
        { label: this.$t('none'), value: 0 },
        { label: this.$t('daily'), value: 1 },
        { label: this.$t('weekly'), value: 2 }
      ],
      selectedFrequency: undefined
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    details () {
      return this.user.details
    },
    isSavingProfilePicture () {
      return this.$store.getters['currentActions/isInProgress']('saveProfilePicture')
      // return true
    }
  },
  created () {
    if (this.details.lastName === undefined) {
      this.getPersonalDetails()
    }
    this.themeColor = this.$store.state.user.themeColor
  },
  methods: {
    getPersonalDetails () {
      this.$store.dispatch('currentActions/addAction', { name: 'getPersonalDetails' })
      userService.getPersonalDetails().then(
        (data) => {
          this.$store.dispatch('currentActions/removeAction', { name: 'getPersonalDetails' })
          if (data.success) {
            this.$store.dispatch('user/updatePersonalDetails', data)
            this.selectedFrequency = this.frequency[data.reportFrequency]
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
          this.$store.dispatch('currentActions/removeAction', { name: 'getPersonalDetails' })
        })
    },
    onColorChange (newColor) {
      userService.updateThemeColor(newColor).then((data) => {
        if (data.success) {
          PentilaUtils.Theme.updateColor(this.themeColor, newColor)
          this.$store.commit('user/updateInterfacePreferences', { themeColor: newColor })
          this.themeColor = this.$store.state.user.themeColor
          this.$emit('save')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    onFrequencySelect (newfrequency) {
      if (this.selectedFrequency) {
        userService.updateReportFrequency(newfrequency.value).then((data) => {
          if (data.success) {
            this.$store.dispatch('user/updatePersonalDetails', {
              ...this.details,
              reportFrequency: newfrequency.value
            })
            this.selectedFrequency = this.frequency[newfrequency.value]
            this.$emit('save')
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    toggleImagePicker () {
      this.show = !this.show
    },
    selectImage ({ blob, fileName }) {
      const formData = new FormData()
      formData.append('picture', blob, fileName)
      this.$store.dispatch('user/saveProfilePicture', formData)
    },
    removePicture () {
      this.$store.dispatch('user/removePicture')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  &:not(:first-child) {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid $color-border;
  }
}

h4 {
  margin: 0 0 0.5rem 0;
  @extend %font-bold-l;
}

.user-picture {
  .body{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;

    .left-section {
      display: flex;

      .thumbnail-container {
        display: inline-block;
        position: relative;

        .picture {
          cursor: pointer;
        }

        .cancel, .add-picture {
          position: absolute;
          z-index: 2;
          top: 0;
          right: 5px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            height: 16px;
          }
        }

        .add-picture {
          background-color: $success;
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "none": "Aucun",
  "daily": "Quotidien",
  "weekly": "Hebdomadaire",
  "addressLabel": "Adresse: ",
  "deleteButtonTitle": "Supprimer la photo de profil",
  "addButtonTitle": "Ajouter une image de profil",
  "emailAddressLabel": "Courriel: ",
  "homePhoneNumberLabel": "Téléphone maison: ",
  "mobilePhoneNumberLabel": "Téléphone mobile: ",
  "officePhoneNumberLabel": "Téléphone bureau: ",
  "smsPhoneNumberLabel": "Téléphone SMS: ",
  "activityReport": "Rapport d'activités",
  "reportChange": "Signaler un changement",
  "themeColor": "Couleur du thème",
  "userPicture": "Image de profil"
}
</i18n>
