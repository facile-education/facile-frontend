<template>
  <div class="account-tab">
    <section class="user-data">
      <h4 v-t="'userData'" />
      <div class="body">
        <div class="left-section">
          <div class="user-picture">
            <img
              class="picture"
              :src="userPicture"
              alt="user picture"
              @click="toggleImagePicker"
            >
            <PentilaButton
              :title="$t('deleteButtonTitle')"
              type="circle"
              cls="cancel delete"
              @click="removePicture"
            >
              <img
                src="@/assets/icon_trash_white.svg"
                alt="trash"
              >
            </PentilaButton>
          </div>
          <div class="user-information">
            <div class="name">
              {{ user.firstName + ' ' + user.lastName }}
            </div>
            <div v-if="details.emailAddress">
              <label v-t="'emailAddressLabel'" /> {{ details.emailAddress }}
            </div>
            <div v-if="details.address">
              <label v-t="'addressLabel'" /> {{ details.address }}
            </div>
            <div v-if="details.mobilePhoneNumber">
              <label v-t="'mobilePhoneNumberLabel'" /> {{ details.mobilePhoneNumber }}
            </div>
            <div v-if="details.smsPhoneNumber">
              <label v-t="'smsPhoneNumberLabel'" /> {{ details.smsPhoneNumber }}
            </div>
            <div v-if="details.homePhoneNumber">
              <label v-t="'homePhoneNumberLabel'" /> {{ details.homePhoneNumber }}
            </div>
            <div v-if="details.officePhoneNumber">
              <label v-t="'officePhoneNumberLabel'" /> {{ details.officePhoneNumber }}
            </div>
          </div>
        </div>
        <PentilaButton
          :title="$t('reportChange')"
          @click="reportChange"
        >
          {{ $t('reportChange') }}
        </PentilaButton>
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
        @update:modelValue="onFrequencySelect"
      />
    </section>
    <section class="webdav">
      <div class="webdav-line">
        <h4 v-t="'webdav'" />
        <PentilaCheckbox
          :model-value="webdavValue"
          label=""
          class="checkbox"
          @click.stop
          @update:modelValue="onWebdavChange"
        />
      </div>
      <button
        class="webdav-line"
        @click="copyWebdavUrl"
      >
        <span v-t="'copyWebdavUrl'" />
        <img
          src="@/assets/icon_copy.svg"
          alt="copy icon"
        >
      </button>
      <button
        v-if="details && !details.isLocalUser"
        class="webdav-line"
        @click="isCollapsed=!isCollapsed"
      >
        <span v-t="'updateWebdavPassword'" />
        <img
          :class="isCollapsed ? 'extend': 'collapse'"
          src="@assets/arrow-right.svg"
          :alt="isCollapsed ? $t('unCollapse') : $t('collapse')"
          :title="isCollapsed ? $t('unCollapse') : $t('collapse')"
        >
      </button>
      <div
        v-if="!isCollapsed"
        class="change-password"
      >
        <PentilaInput
          v-model="password"
          type="password"
          class="item"
          :placeholder="$t('newPassword')"
        />
        <PentilaInput
          v-model="confirmedPassword"
          type="password"
          class="item"
          :placeholder="$t('confirmNewPassword')"
        />
        <PentilaErrorMessage :error-message="confirmationError" />
        <PentilaButton
          class="item pentila-button"
          :label="$t('updateWebdavPassword')"
          @click="updateWebdavPassword"
        />
      </div>
    </section>
  </div>

  <teleport to="body">
    <ImagePickerModal
      v-if="show"
      @save="selectImage"
      @close="toggleImagePicker"
    />
    <AssistanceModal
      v-if="isSupportModalDisplayed"
      @close="isSupportModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import ColorPicker from '@components/Nero/ColorPicker'
import PentilaUtils from 'pentila-utils'
import userService from '@/api/user.service'
import { defineAsyncComponent } from 'vue'
const ImagePickerModal = defineAsyncComponent(() => import('@/components/Nero/ImagePicker'))
const AssistanceModal = defineAsyncComponent(() => import('@/components/Assistance/AssistanceModal'))

export default {
  name: 'AccountTab',
  components: { AssistanceModal, ColorPicker, ImagePickerModal },
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
      selectedFrequency: undefined,
      webdavValue: false,
      isCollapsed: true,
      password: '',
      confirmedPassword: '',
      confirmationError: '',
      isSupportModalDisplayed: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    details () {
      return this.user.details
    },
    userPicture () {
      return this.user.picture
    }
  },
  created () {
    if (this.details.lastName === undefined) {
      this.getPersonalDetails()
    }
    this.themeColor = this.$store.state.user.themeColor
    this.webdavValue = this.$store.state.user.hasWebdavEnabled
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
        })
    },
    onColorChange (newColor) {
      userService.updateThemeColor(newColor).then((data) => {
        if (data.success) {
          PentilaUtils.Theme.updateColor(this.themeColor, newColor)
          this.themeColor = newColor
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
          } else {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    onWebdavChange (value) {
      userService.updateWebdavState(value).then((data) => {
        if (data.success) {
          this.webdavValue = value
          // todo update value in store
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    updateWebdavPassword () {
      if (this.password !== this.confirmedPassword) {
        this.confirmationError = this.$t('confirmationError')
      } else {
        userService.updateWebdavPassword(this.password, this.confirmedPassword).then((data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('updatedPassword'), type: 'success' })
            this.confirmationError = ''
            this.isCollapsed = true
          } else {
            this.confirmationError = data.portal_message
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
          }
        })
      }
    },
    reportChange () {
      this.isSupportModalDisplayed = true
    },
    copyWebdavUrl () {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.clipboard.writeText('https://' + window.location.hostname + this.details.webdavUrl) // TODO: make the 'https://hostname' returned by the backend in the webdavUrl
        }
      })
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

.account-tab {
  section {
    margin-top: 10px;
    border-top: 1px solid $color-border;
    padding-top: 10px;

    h4 {
      margin: 0;
    }
  }

  .user-data {
    .body{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .left-section {
        display: flex;

        .user-picture {
          display: inline-block;
          position: relative;

          .picture {
            cursor: pointer;
            height: 100px;
            width: 100px;
            border-radius: 50%;
          }

          .cancel {
            position: absolute;
            z-index: 2;
            right: 5px;
          }
        }

        .user-information {
          margin: auto 40px;

          .name{
            font-weight: 600;
          }
        }

      }
    }

  }

  .theme-color, .activity-report {
    display: flex;
    justify-content: space-between;
  }

  .webdav {
    .webdav-line {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .checkbox {
      padding-left: 20px;
    }

    button:not(.pentila-button) {
      align-items: center;
      height: 25px;
      cursor: pointer;
      background-color: transparent;
      border: none;
      padding: 0;

      img {
        width: 18px;
        height: 18px;
      }

      .collapse, .extend {
        width: 10px;
        transition:  transform .3s;
        cursor: pointer;
      }

      .extend {
        transform: rotate(0);
      }

      .collapse {
        transform: rotate(90deg);
      }

      &:hover {
        font-weight: 600;
      }
    }

    .change-password {
      width: 100%;

      .item {
        margin-top: 10px;
      }

      .pentila-button {
        margin-left: auto;
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
  "emailAddressLabel": "Courriel: ",
  "homePhoneNumberLabel": "Téléphone maison: ",
  "mobilePhoneNumberLabel": "Téléphone mobile: ",
  "officePhoneNumberLabel": "Téléphone bureau: ",
  "smsPhoneNumberLabel": "Téléphone SMS: ",
  "activityReport": "Rapport d'activités",
  "reportChange": "Signaler un changement",
  "themeColor": "Couleur du thème",
  "userData": "Informations personelles",
  "webdav": "Activer le Webdav",
  "copyWebdavUrl": "Copier le lien webdav",
  "updateWebdavPassword": "Réinitialiser le mot de passe",
  "collapse": "replier",
  "unCollapse": "déplier",
  "newPassword": "Nouveau mot de passe",
  "confirmNewPassword": "Confirmation du mot de passe",
  "updatedPassword": "Mot de passe mis à jour",
  "confirmationError": "Le mot de passe ne correspond pas"
}
</i18n>
